// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const { SecretClient } = require('@azure/keyvault-secrets');
const { EnvironmentCredential } = require('@azure/identity');

const KeyStore = require('./key-store');
const { getErrorInfo } = require('../utils');

const logger = require('../utils/logger').getLogger('key-vault');

const keyVaultUrl = process.env.KEY_VAULT_URL;

const keyVaultClient = new SecretClient(
    keyVaultUrl, new EnvironmentCredential()
);

class KeyVault extends KeyStore {
    async saveSecret(key, value) {
        logger.info(`Attempting to save secret with key ${key}`);
        try {
            try {
                await this.getSecret(key);
                const error = new Error('Issuer already exists');
                error.status = 409;
                throw error;
            } catch(err) {
                const { errorStatus } = getErrorInfo(err);
                if (errorStatus !== 404) {
                    throw err;
                }
            }

            await keyVaultClient.setSecret(
                key.replace('.', '-'),
                JSON.stringify(value)
            );
        } catch(err) {
            const { errorStatus, errorMsg } = getErrorInfo(err);
            const newError = new Error(`Unable to save secret with key ${key}: ${errorMsg}`);
            newError.status = errorStatus;
            throw newError;
        }
        logger.info(`Successfully saved secret with key ${key}`);
    }
    
    // setSecret in KV will automatically update the secret
    // eslint-disable-next-line class-methods-use-this
    async updateSecret(key, value) {
        logger.info(`Attempting to update secret with key ${key}`);
        try {
            await keyVaultClient.setSecret(
                key.replace('.', '-'),
                JSON.stringify(value)
            );
        } catch(err) {
            const { errorStatus, errorMsg } = getErrorInfo(err);
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
            const response = await keyVaultClient.getSecret(key.replace('.', '-'));
            logger.info(`Successfully found secret with key ${key}`);
            return JSON.parse(response.value);
        } catch(err) {
            const { errorStatus, errorMsg } = getErrorInfo(err);
            const newError = new Error(`Unable to get secret with key ${key}: ${errorMsg}`);
            newError.status = errorStatus;
            throw newError;
        }
    }
}

module.exports = KeyVault
