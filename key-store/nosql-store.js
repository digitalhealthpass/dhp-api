// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

// This will use the NoSQL DB defined in NOSQL_DB_FILE_NAME

const KeyStore = require('./key-store');
const { getErrorInfo } = require('../utils');
const dbHelper = require('../helpers/nosql-db-helper');
const constants = require('../helpers/constants');

const logger = require('../utils/logger').getLogger('nosql-store');

class NoSqlStore extends KeyStore {
    // eslint-disable-next-line class-methods-use-this
    async saveSecret(key, value) {
        logger.info(`Attempting to save secret with key ${key}`);
        try {
            const valueCopy = JSON.parse(JSON.stringify(value));
            valueCopy.id = key;
            await dbHelper.getInstance().writeDoc(
                constants.NOSQL_CONTAINER_ID.KEYS,
                valueCopy
            );
        } catch(err) {
            const { errorStatus, errorMsg } = getErrorInfo(err);
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
            const doc = await dbHelper.getInstance().getDoc(
                constants.NOSQL_CONTAINER_ID.KEYS,
                key
            );
            const valueCopy = JSON.parse(JSON.stringify(value));
            valueCopy.id = doc.id;
            valueCopy.rev = doc.rev;
            await dbHelper.getInstance().putDoc(
                constants.NOSQL_CONTAINER_ID.KEYS,
                valueCopy
            );
        } catch(err) {
            const { errorStatus, errorMsg } = getErrorInfo(err);
            const newError = new Error(`Unable to update secret with key ${key}: ${errorMsg}`);
            newError.status = errorStatus;
            throw newError;
        }
        logger.info(`Successfully updated secret with key ${key}`);
    };
    
    // eslint-disable-next-line class-methods-use-this
    async getSecret(key) {
        logger.info(`Attempting to get secret with key ${key}`);
        try {
            return await dbHelper.getInstance().getDoc(
                constants.NOSQL_CONTAINER_ID.KEYS,
                key
            )
        } catch(err) {
            const { errorStatus, errorMsg } = getErrorInfo(err);
            const newError = new Error(`Unable to get secret with key ${key}: ${errorMsg}`);
            newError.status = errorStatus;
            throw newError;
        }
    }
}

module.exports = NoSqlStore;
