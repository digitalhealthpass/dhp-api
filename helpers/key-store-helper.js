// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const path = require('path');

const KeyStore = require('../key-store/key-store');
const { getErrorInfo } = require('../utils');

const logger = require('../utils/logger').getLogger(
    'key-store-helper'
);

// placeholder so intellisense works
let instance = new KeyStore();

const init = () => {
    const fileName = process.env.KEY_STORE_FILE_NAME;
    const filePath = path.join(__dirname, '..', 'key-store', fileName);

    logger.info(`Loading key store from ${fileName}`);

    try {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const keyStore = require(filePath);
        // eslint-disable-next-line new-cap
        instance = new KeyStore(new keyStore());
    } catch (err) {
        const { errorStatus, errorMsg } = getErrorInfo(err);
        const error = new Error(
            `Unable to load keystore file ${fileName}: ${errorMsg}`
        );
        error.status = errorStatus;
        throw error;
    }
}

const getInstance = () => {
    return instance;
}

module.exports = {
    init,
    getInstance,
}
