// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const path = require('path');

const NoSqlDB = require('../nosql-db/nosql-db');
const { getErrorInfo } = require('../utils');

const logger = require('../utils/logger').getLogger(
    'nosql-db-helper'
);

// placeholder so intellisense works
let instance = new NoSqlDB();

const init = () => {
    const fileName = process.env.NOSQL_DB_FILE_NAME;
    const filePath = path.join(__dirname, '..', 'nosql-db', fileName);

    logger.info(`Loading NoSQL DB from ${fileName}`);

    try {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const db = require(filePath);
        // eslint-disable-next-line new-cap
        const instantiatedDb = new db();
        instance = new NoSqlDB(instantiatedDb);
    } catch (err) {
        const { errorMsg } = getErrorInfo(err);
        throw new Error(
            `Unable to load NoSQL DB helper file ${fileName}: ${errorMsg}`
        );
    }
}

const removeUnderscores = (doc) => {
    const docCopy = JSON.parse(JSON.stringify(doc));
    docCopy.id = doc._id;
    docCopy.rev = doc._rev;
    delete docCopy._id;
    delete docCopy._rev;
    return docCopy;
}

const addUnderscores = (doc) => {
    const docCopy = JSON.parse(JSON.stringify(doc));
    docCopy._id = doc.id;
    docCopy._rev = doc.rev;
    delete docCopy.id;
    delete docCopy.rev;
    return docCopy;
}

const verifyDoc = (doc) => {
    if (!doc.id) {
        const error = new Error('Document is missing id');
        error.status = 400;
        throw error;
    }
}

const handleError = (err, method, docID) => {
    const { errorStatus, errorMsg } = getErrorInfo(err);
    const error = new Error(`Method: ${method}; Doc ID: ${docID}; Error: ${errorMsg}`);
    error.status = errorStatus;
    throw error;
}

const getInstance = () => {
    return instance;
}

module.exports = {
    init,
    removeUnderscores,
    addUnderscores,
    verifyDoc,
    handleError,
    getInstance,
}
