/* eslint-disable no-underscore-dangle */
// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

// TODO: partition containers

const { CosmosClient } = require('@azure/cosmos');

const NoSqlDB = require('./nosql-db');
const constants = require('../helpers/constants');
const { getErrorInfo } = require('../utils');

const logger = require('../utils/logger').getLogger('cosmos-db');

const endpoint = process.env.COSMOS_DB_URL;
const key = process.env.COSMOS_DB_KEY;
const databaseId = constants.COSMOSE_DB_ID;
const issuerContainerId = constants.NOSQL_CONTAINER_ID.ISSUER
const schemaContainerId = constants.NOSQL_CONTAINER_ID.SCHEMA;
const revokedCredentialContainerId = constants.NOSQL_CONTAINER_ID.REVOKED_CREDENTIAL;
const keysContainerId = constants.NOSQL_CONTAINER_ID.KEYS;
const metadataContainerId = constants.NOSQL_CONTAINER_ID.META_DATA;

const client = new CosmosClient({ endpoint, key });
let issuerContainer;
let schemaContainer;
let revokedCredentialContainer;
let keysContainer;
let metadataContainer

const validateEnvVars = () => {
    const missing = [];
    if (!endpoint) {
        missing.push('COSMOS_DB_URL');
    }
    if (!key) {
        missing.push('COSMOS_DB_KEY');
    }
    if (!databaseId) {
        missing.push('COSMOSE_DB_ID');
    }

    if (missing.length > 0) {
        throw new Error(
            `Missing environmental variables for Cosmos DB: ${missing}`
        );
    }
}

const cleanErrorMessage = (message) => {
    // Cosmos DB error messages contain a lot
    // of unneeded info after this index
    const index = message.indexOf('\r\n');
    if (index === -1) {
        return message
    }

    return message.substring(0, index)
}

const createContainer = async(containerId) => {
    logger.info(`Creating Cosmos container ${containerId} in DB ${databaseId}`);
    const { container } = (await client
        .database(databaseId)
        .containers
        .createIfNotExists({
            id: containerId,
        }));
    logger.info(`Created Cosmos container ${containerId} in DB ${databaseId}`);
    return container;
}

const verifyDoc = (doc) => {
    if (!doc.id) {
        const error = new Error('Document is missing id');
        error.status = 400;
        throw error;
    }
}

const getContainer = (containerId) => {
    const throwError = () => {
        const error = new Error(`Unknown container id ${containerId}`);
        error.status = 500;
        throw error;
    }
    
    switch (containerId) {
        case constants.NOSQL_CONTAINER_ID.ISSUER:
            return issuerContainer;
        case constants.NOSQL_CONTAINER_ID.SCHEMA:
            return schemaContainer;
        case constants.NOSQL_CONTAINER_ID.REVOKED_CREDENTIAL:
            return revokedCredentialContainer;
        case constants.NOSQL_CONTAINER_ID.KEYS:
            return keysContainer;
        case constants.NOSQL_CONTAINER_ID.META_DATA:
            return metadataContainer;
        default:
            return throwError();
    }
}

class CosmosDB extends NoSqlDB {
    // eslint-disable-next-line class-methods-use-this
    async init() {
        validateEnvVars();
        logger.info(`Creating Cosmos DB ${databaseId}`);

        try {
            await client.databases.createIfNotExists({
                id: databaseId
            }).database;
            logger.info(`Created Cosmos DB ${databaseId}`);
    
            issuerContainer = await createContainer(issuerContainerId);
            schemaContainer = await createContainer(schemaContainerId);
            revokedCredentialContainer = await createContainer(revokedCredentialContainerId);
            keysContainer = await createContainer(keysContainerId);
            metadataContainer = await createContainer(metadataContainerId);
        } catch(err) {
            const { errorMsg } = getErrorInfo(err);
            logger.error(`Unable to initialize Cosmos DB: ${errorMsg}`);
            throw err;
        }
    }

    // eslint-disable-next-line class-methods-use-this
    async getDoc(containerId, docID) {
        logger.info(`getDoc ${docID} from ${containerId} container`);

        try {
            const container = getContainer(containerId);
            const response = await container.item(docID).read();

            if (response.statusCode !== 200) {
                const err = new Error(
                    `Unable to get doc ${docID}`
                );
                err.status = response.statusCode;
                throw err
            }
            return response.resource;
        } catch (err) {
            err.message = cleanErrorMessage(err.message);
            logger.error(
                `Unable to get doc ${docID} from ${containerId} container:`, err.message
            );
            throw err;
        }
    };

    async getAllDocs(containerId, limit, skip) {
        logger.info(`getAllDocs from ${containerId} container`);

        try {
            const container = getContainer(containerId);

            const response = await container.items.query(
                `SELECT * from c OFFSET ${skip} LIMIT ${limit}`
            ).fetchAll();

            if (response.statusCode && response.statusCode !== 200) {
                const err = new Error(
                    `Unable to get docs`
                );
                err.status = response.statusCode;
                throw err
            }

            const rows = response.resources.map(doc => this.sanitizeDoc(doc));

            return {
                total_rows: rows.length,
                limit,
                skip,
                payload: rows
            };
        } catch (err) {
            err.message = cleanErrorMessage(err.message);
            logger.error(
                `Unable to get docs from ${containerId} container:`, err.message
            );
            throw err;
        }
    }

    async getAllRevokedCredentials(limit, skip) {
        return this.getAllDocs(
            constants.NOSQL_CONTAINER_ID.REVOKED_CREDENTIAL, limit, skip
        );
    }

    async getAllPublicKeys(limit, skip) {
        return this.getAllDocs(
            constants.NOSQL_CONTAINER_ID.ISSUER, limit, skip
        );
    }

    async getAllSchemas(limit, skip) {
        return this.getAllDocs(
            constants.NOSQL_CONTAINER_ID.SCHEMA, limit, skip
        );
    }

    // eslint-disable-next-line class-methods-use-this
    async writeDoc(containerId, doc) {
        logger.info(`writeDoc ${doc.id} to ${containerId} container`);
        verifyDoc(doc);

        try {
            const container = getContainer(containerId);

            const response = await container.items.create(doc);

            if (response.statusCode !== 201) {
                const err = new Error(
                    `Unable to writeDoc ${doc.id}`
                );
                err.status = response.statusCode;
                throw err
            }
            return response.resource;
        } catch (err) {
            err.message = cleanErrorMessage(err.message);
            logger.error(
                `Unable to writeDoc ${doc.id} from ${containerId} container:`, err.message
            );
            throw err;
        }
    };

    // eslint-disable-next-line class-methods-use-this
    async putDoc(containerId, doc) {
        logger.info(`putDoc ${doc.id} from ${containerId} container`);
        verifyDoc(doc);

        try {
            const container = getContainer(containerId);
            const response = await container
                .item(doc.id)
                .replace(doc);

            if (response.statusCode !== 200) {
                const err = new Error(
                    `Unable to putDoc ${doc.id}`
                );
                err.status = response.statusCode;
                throw err
            }
            return response.resource;
        } catch (err) {
            err.message = cleanErrorMessage(err.message);
            logger.error(
                `Unable to putDoc ${doc.id} from ${containerId} container:`, err.message
            );
            throw err;
        }
    };

    // eslint-disable-next-line class-methods-use-this
    async deleteDoc(containerId, docID) {
        logger.info(`deleteDoc ${docID} from ${containerId} container`);

        try {
            const container = getContainer(containerId);
            const response = await container.item(docID).delete();

            if (response.statusCode !== 204) {
                const err = new Error(
                    `Unable to deleteDoc ${docID}`
                );
                err.status = response.statusCode;
                throw err
            }
            return response.resource;
        } catch (err) {
            const { errorStatus } = getErrorInfo(err);
            if (errorStatus === 404) {
                const error = new Error(`Document not found`);
                error.status = 404;
                throw error;
            }

            err.message = cleanErrorMessage(err.message);
            logger.error(
                `Unable to deleteDoc ${docID} from ${containerId} container:`, err.message
            );
            throw err;
        }
    };

    // eslint-disable-next-line class-methods-use-this
    sanitizeDoc(doc) {
        const docCopy = JSON.parse(JSON.stringify(doc));

        delete docCopy._rid;
        delete docCopy._self;
        delete docCopy._etag;
        delete docCopy._attachments;
        delete docCopy._ts;

        return docCopy;
    }
}

module.exports = CosmosDB;
