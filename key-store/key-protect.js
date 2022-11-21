// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const axios = require('axios');
const rax = require('retry-axios');

const KeyStore = require('./key-store');
const cloudIamHelper = require('../helpers/ibm-cloud-iam-helper');
const { getErrorInfo } = require('../utils');

const logger = require('../utils/logger').getLogger('key-protect');

const keyProtectURL = process.env.KEY_PROTECT_URL;
const keyProtectGUID = process.env.KEY_PROTECT_GUID;
const keyProtectApiKey = process.env.KEY_PROTECT_IAM_KEY;
const keyProtectTimeout = process.env.KEY_PROTECT_TIMEOUT || 10000
const keyProtectRetries = process.env.KEY_PROTECT_RETRIES || 1;
const keyProtectRetryDelay = process.env.KEY_PROTECT_RETRY_DELAY || 3000;

const setClientRetry = (client) => {
    return {
        instance: client,
        retry: keyProtectRetries,
        noResponseRetries: keyProtectRetries,
        statusCodesToRetry: [[500, 599]],
        keyProtectRetryDelay,
        onRetryAttempt: (err) => {
            const cfg = rax.getConfig(err);
            logger.warn('No response received from KeyProtect, retrying request');
            logger.warn(`Retry attempt #${cfg.currentRetryAttempt}`);
        },
    };
}

const getClient = async (params) => {
    const token = await cloudIamHelper.getCloudIAMToken(keyProtectApiKey);
    const client = axios.create({
        baseURL: keyProtectURL,
        timeout: keyProtectTimeout,
        headers: {
            Accept: 'application/vnd.ibm.kms.key+json',
            Authorization: `Bearer ${token}`,
            'bluemix-instance': keyProtectGUID,
        },
        params,
    });

    client.defaults.raxConfig = setClientRetry(client);
    rax.attach(client);

    return client;
};

const keyResourcesExist = (response) => {
    return response
        && response.data
        && response.data.resources
        && response.data.resources.length;
}

const keyPayloadExists = (response) => {
    return keyResourcesExist(response)
        && response.data.resources[0].payload;
}

const getKeyPayload = (response) => {
    if (!keyPayloadExists(response)) {
        return undefined;
    }
    const { payload } = response.data.resources[0];
    const decodedPayload = Buffer.from(payload, 'base64').toString();
    logger.debug('Successfully parsed key from KeyProtect');
    return decodedPayload;
};

const getRequestErrorInfo = (error) => {
    if (keyResourcesExist(error.response)) {
        return {
            errorStatus: 400,
            errorMsg: JSON.stringify(error.response.data.resources)
        }
    }
    return getErrorInfo(error);
}

const doSaveSecretPost = async (key, value, client) => {
    const encodedPayload = Buffer
        .from(JSON.stringify(value))
        .toString('base64');

    const requestBody = {
        metadata: {
            collectionType: 'application/vnd.ibm.kms.key+json',
            collectionTotal: 1,
        },
        resources: [
            {
                type: 'application/vnd.ibm.kms.key+json',
                name: key,
                alias: key,
                description: 'Issuer Key Pair',
                extractable: true,
                payload: encodedPayload,

            },
        ],
    };

    await client.post('', JSON.stringify(requestBody));
}

// TODO: search by name does not return payload.  Why?
const getSecretId = async (key) => {
    const client = await getClient({ search: `name:${key}` });
    const response = await client.get();
    if (keyResourcesExist(response)) {
        return response.data.resources[0].id;
    }
    return undefined;
}

class KeyProtect extends KeyStore {
    async saveSecret(key, value) {
        logger.info(`Attempting to save secret with key ${key}`);
        try {
            try {
                const secret = await this.getSecret(key);
                if (secret) {
                    const error = new Error(`Issuer already exists`);
                    error.status = 409;
                    throw error;
                }
            } catch (err) {
                const { errorStatus } = getRequestErrorInfo(err);
                if (errorStatus !== 404) {
                    throw err;
                }
            }

            const client = await getClient();

            await doSaveSecretPost(key, value, client);
        } catch (err) {
            const { errorStatus, errorMsg } = getRequestErrorInfo(err);
            const newError = new Error(`Unable to save secret with key ${key}: ${errorMsg}`);
            newError.status = errorStatus;
            throw newError;
        }
        logger.info(`Successfully saved secret with key ${key}`);
    }

    // eslint-disable-next-line class-methods-use-this
    async updateSecret(key, value) {
        logger.info(`Attempting to update secret with key ${key}`);
        try {
            const id = await getSecretId(key);
            const client = await getClient();
            await client.delete(id);
            await doSaveSecretPost(key, value, client);
        } catch (err) {
            const { errorStatus, errorMsg } = getRequestErrorInfo(err);
            const newError = new Error(`Unable to save update with key ${key}: ${errorMsg}`);
            newError.status = errorStatus;
            throw newError;
        }
        logger.info(`Successfully updated secret with key ${key}`);
    };

    // eslint-disable-next-line class-methods-use-this
    async getSecret(key) {
        logger.info(`Attempting to get secret with key ${key}`);
        try {
            const id = await getSecretId(key);
            const client = await getClient();
            const response = await client.get(id);
            const secret = getKeyPayload(response);

            if (!secret) {
                const error = new Error('Not found');
                error.status = 404;
                throw error
            }
            return JSON.parse(secret);
        } catch (err) {
            const { errorStatus, errorMsg } = getRequestErrorInfo(err);
            const newError = new Error(`Unable to get secret with key ${key}: ${errorMsg}`);
            newError.status = errorStatus;
            throw newError;
        }
    }
}

module.exports = KeyProtect
