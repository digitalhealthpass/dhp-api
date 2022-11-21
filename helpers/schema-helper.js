// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const moment = require('moment');

const issuerHelper = require("./issuer-helper");
const constants = require("./constants");
const encryptionHelper = require('./encryption-helper');
const dbHelper = require('./nosql-db-helper');
const { getErrorInfo } = require('../utils');

const getSchema = async (schemaID) => {
    try {
        const schema = await dbHelper.getInstance().getDoc(
            constants.NOSQL_CONTAINER_ID.SCHEMA, schemaID
        );
        return await dbHelper.getInstance().sanitizeDoc(schema);
    } catch(err) {
        const { errorStatus } = getErrorInfo(err);
        if (errorStatus === 404) {
            const error = new Error('Schema not found');
            error.status = errorStatus;
            throw error;
        }
        throw err;
    }
}

const getAllSchemas = async (limit, skip) => {
    try {
        const response = await dbHelper.getInstance().getAllSchemas(
            limit, skip
        );
        return response;
    } catch(err) {
        const { errorStatus } = getErrorInfo(err);
        if (errorStatus === 404) {
            const error = new Error('No schemas found');
            error.status = errorStatus;
            throw error;
        }
        throw err;
    }
}

const createSchema = async (issuerId, schema) => {
    const schemaCopy = JSON.parse(JSON.stringify(schema));
    const keyPair = await issuerHelper.getKeyPair(issuerId);
    if (!keyPair) {
        const error = new Error(`Unknown issuer id`);
        error.status = 404;
        throw error;
    }

    const author = keyPair.creator
    const id = `${author};id=${schema.id};version=${schema.version}`;

    schemaCopy.id = id;
    schemaCopy.author = author;
    schemaCopy.authored = `${moment().toISOString().slice(0,-5)}Z`;
    schemaCopy.modelVersion = schema.version;
    schemaCopy.name = schema.name;

    const signedSchema = encryptionHelper.signCredential(keyPair.keys[1], keyPair.id, schemaCopy);

    const savedSchemaDoc = await dbHelper.getInstance().writeDoc(
        constants.NOSQL_CONTAINER_ID.SCHEMA,
        signedSchema
    );
    
    return dbHelper.getInstance().sanitizeDoc(savedSchemaDoc);
}

module.exports = {
    getSchema,
    createSchema,
    getAllSchemas,
}
