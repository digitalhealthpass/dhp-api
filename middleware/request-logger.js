// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const { v4: uuidv4 } = require('uuid');

const logger = require('../utils/logger').getLogger('request-logger');
const { REQUEST_HEADERS } = require('../helpers/constants');
const { getAsyncLocalStorage } = require(
    '../helpers/async-local-storage-helper'
);

const logRequestInfo = (req, res, next) => {
    let txID = req.headers[REQUEST_HEADERS.TRANSACTION_ID];
    if (!txID) {
        txID = uuidv4();
        req.headers[REQUEST_HEADERS.TRANSACTION_ID] = txID;
    }

    logger.debug(`Incoming request: ${req.method} ${req.originalUrl}; txID: ${txID}`);

    const asyncLocalStorage = getAsyncLocalStorage();

    asyncLocalStorage.run(new Map(), () => {
        asyncLocalStorage.getStore().set('txID', txID);
        next();
    });
};

module.exports = logRequestInfo;
