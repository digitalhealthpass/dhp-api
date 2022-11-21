// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

// TODO: partition containers

const nano = require('nano');

const NoSqlDB = require('./nosql-db');
const constants = require('../helpers/constants');
const dbHelper = require('../helpers/nosql-db-helper');
const { getErrorInfo } = require('../utils');

const logger = require('../utils/logger').getLogger('couchdb');

const couch = nano(process.env.COUCHDB_URL);

const issuerDbName = constants.NOSQL_CONTAINER_ID.ISSUER
const schemaDbName = constants.NOSQL_CONTAINER_ID.SCHEMA;
const revokedDbName = constants.NOSQL_CONTAINER_ID.REVOKED_CREDENTIAL;
const keysDbName = constants.NOSQL_CONTAINER_ID.KEYS;
const metadataDbName = constants.NOSQL_CONTAINER_ID.META_DATA;

let issuerDB;
let schemaDB;
let revokedCredentialDB;
let keysDB;
let metadataDB

const getDB = (dbName) => {
    const throwError = () => {
        const error = new Error(`Unknown database id ${dbName}`);
        error.status = 500;
        throw error;
    }

    switch (dbName) {
        case constants.NOSQL_CONTAINER_ID.ISSUER:
            return issuerDB;
        case constants.NOSQL_CONTAINER_ID.SCHEMA:
            return schemaDB;
        case constants.NOSQL_CONTAINER_ID.REVOKED_CREDENTIAL:
            return revokedCredentialDB;
        case constants.NOSQL_CONTAINER_ID.KEYS:
            return keysDB;
        case constants.NOSQL_CONTAINER_ID.META_DATA:
            return metadataDB;
        default:
            return throwError();
    }
}

const createDb = async (dbName, dbList, partitioned) => {
    if (dbList.includes(dbName)) {
        logger.info(`CouchDB ${dbName} already exists`);
    } else {
        await couch.db.create(dbName, { partitioned });
        logger.info(`Successfully created CouchDB ${dbName}`);
    }
    return couch.use(dbName);
}

class CouchDB extends NoSqlDB {
    // eslint-disable-next-line class-methods-use-this
    async init() {
        try {
            const dbList = await couch.db.list();
            issuerDB = await createDb(issuerDbName, dbList, false);
            schemaDB = await createDb(schemaDbName, dbList, false);
            revokedCredentialDB = await createDb(revokedDbName, dbList, false);
            keysDB = await createDb(keysDbName, dbList, false);
            metadataDB = await createDb(metadataDbName, dbList, false);
        } catch(err) {
            const { errorMsg } = getErrorInfo(err);
            logger.error(`Unable to initialize CouchDB: ${errorMsg}`);
            throw err;
        }
    }

    // eslint-disable-next-line class-methods-use-this
    async getDoc(dbName, docID) {
        logger.info(`getDoc ${docID} from ${dbName} database`);

        const db = getDB(dbName);

        try {
            const response = await db.get(docID);
            return dbHelper.removeUnderscores(response);
        } catch(err) {
            return dbHelper.handleError(err, 'getDoc', docID);
        }
    };

    // eslint-disable-next-line class-methods-use-this
    async getAllDocs(dbName, limit, skip) {
        logger.info(`getAllDocs from ${dbName} database`);
        const db = getDB(dbName);

        const options = {
            include_docs: true,
            limit,
            skip,
            descending: false
        }

        try {
            const response = await db.list(options);
            return {
                total_rows: response.rows.length,
                limit,
                skip,
                payload: response.rows,
            };
        } catch(err) {
            const { errorStatus, errorMsg } = getErrorInfo(err);
            const error = new Error(`Method: getAllDocs; Error: ${errorMsg}`);
            error.status = errorStatus;
            throw error;
        }
    }

    async getAllRevokedCredentials(limit, skip) {
        const payload = await this.getAllDocs(
            constants.NOSQL_CONTAINER_ID.REVOKED_CREDENTIAL, limit, skip
        );
        
        payload.payload = payload.payload.reduce(
            (acc, row) => {
                acc.push({
                    id: row.doc._id,
                    rev: row.doc._rev,
                    reason: row.doc.reason,
                });
                return acc;
            }, []
        );

        return payload;
    }

    async getAllPublicKeys(limit, skip) {
        const payload = await this.getAllDocs(
            constants.NOSQL_CONTAINER_ID.ISSUER, limit, skip
        );
        
        payload.payload = payload.payload.reduce(
            (acc, row) => {
                acc.push({
                    id: row.doc._id,
                    rev: row.doc._rev,
                    '@context': row.doc['@context'],
                    publicKey: row.doc.publicKey,
                });
                return acc;
            }, []
        );

        return payload;
    }

    async getAllSchemas(limit, skip) {
        const payload = await this.getAllDocs(
            constants.NOSQL_CONTAINER_ID.SCHEMA, limit, skip
        );
        payload.payload = payload.payload.map(
            row => dbHelper.removeUnderscores(row.doc)
        );
        return payload;
    }
    
    // eslint-disable-next-line class-methods-use-this
    async writeDoc(dbName, doc) {
        logger.info(`writeDoc ${doc.id} to ${dbName} database`);
        dbHelper.verifyDoc(doc);

        const db = getDB(dbName);

        try {
            const response = await db.insert(dbHelper.addUnderscores(doc));
            return response;
        } catch(err) {
            return dbHelper.handleError(err, 'writeDoc', doc.id);
        }
    };
    
    // eslint-disable-next-line class-methods-use-this
    async putDoc (dbName, doc) {
        logger.info(`putDoc ${doc.id} from ${dbName} database`);
        dbHelper.verifyDoc(doc);
        if (!doc.rev) {
            const error = new Error('Document is missing rev');
            error.status = 400;
            throw error;
        }

        const db = getDB(dbName);

        try {
            const response = await db.insert(dbHelper.addUnderscores(doc));
            return response;
        } catch(err) {
            return dbHelper.handleError(err, 'putDoc', doc.id);
        }
    };
    
    // eslint-disable-next-line class-methods-use-this
    async deleteDocWithRev(dbName, docID, docRev) {
        logger.info(
            `deleteDoc with id ${docID} and rev ${docRev} from ${dbName} database`
        );

        const db = getDB(dbName);

        return db.destroy(docID, docRev);
    }

    async deleteDocWithoutRev(dbName, docID) {
        logger.info(
            `deleteDoc with id ${docID} from ${dbName} database`
        );

        const db = getDB(dbName);

        const doc = await this.getDoc(dbName, docID);
        const docRev = doc.rev;

        return db.destroy(docID, docRev);
    }

    async deleteDoc (dbName, docID, docRev) {
        try {
            if (docRev) {
                return await this.deleteDocWithRev(dbName, docID, docRev);
            }
            return await this.deleteDocWithoutRev(dbName, docID);
        } catch(err) {
            const { errorStatus } = getErrorInfo(err);
            if (errorStatus === 404) {
                const error = new Error(`Document not found`);
                error.status = 404;
                throw error;
            }
            return dbHelper.handleError(err, 'deleteDoc', docID);
        }
    };
    
    // eslint-disable-next-line class-methods-use-this
    async sanitizeDoc(doc) {
        return doc;
    }
}

module.exports = CouchDB;
