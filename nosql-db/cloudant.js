// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

// TODO: partition containers

const CloudantLib = require('@cloudant/cloudant');

const NoSqlDB = require('./nosql-db');
const constants = require('../helpers/constants');
const dbHelper = require('../helpers/nosql-db-helper');
const { getErrorInfo } = require('../utils');

const logger = require('../utils/logger').getLogger('cloudant');

const cloudantIamKey = process.env.CLOUDANT_IAM_KEY;
const cloudantUrl = process.env.CLOUDANT_URL;

const issuerDbName = constants.NOSQL_CONTAINER_ID.ISSUER
const schemaDbName = constants.NOSQL_CONTAINER_ID.SCHEMA;
const revokedDbName = constants.NOSQL_CONTAINER_ID.REVOKED_CREDENTIAL;
const keysDbName = constants.NOSQL_CONTAINER_ID.KEYS;
const metadataDbName = constants.NOSQL_CONTAINER_ID.META_DATA;

const options = {
    url: cloudantUrl,
    maxAttempt: 0,
    plugins: [
        {
            iamauth: { iamApiKey: cloudantIamKey },
        },
    ],
}

const verifyEnvtVar = () => {
    const missing = [];
    if (!cloudantIamKey) {
        missing.push('CLOUDANT_IAM_KEY');
    }
    if (!cloudantUrl) {
        missing.push('CLOUDANT_URL');
    }

    if (missing.length > 0) {
        throw new Error(
            `Missing environmental variables for Cloudant: ${missing}`
        );
    }
}

class Cloudant extends NoSqlDB {
    async init() {
        verifyEnvtVar();

        try {
            this.cloudant = await CloudantLib(options);
            const dbList = await this.cloudant.db.list();
            await this.createDb(issuerDbName, dbList, false);
            await this.createDb(schemaDbName, dbList, false);
            await this.createDb(revokedDbName, dbList, false);
            await this.createDb(keysDbName, dbList, false);
            await this.createDb(metadataDbName, dbList, false);
        } catch(err) {
            const { errorMsg } = getErrorInfo(err);
            logger.error(`Unable to initialize Cloudant: ${errorMsg}`);
            throw err;
        }
    }

    async getDoc(dbName, docID) {
        logger.info(`getDoc ${docID} from ${dbName} database`);
        
        try {
            const response = await this.cloudant.use(dbName).get(docID);
            return dbHelper.removeUnderscores(response);
        } catch(err) {
            return dbHelper.handleError(err, 'getDoc', docID);
        }
    };

    async getAllDocs(dbName, limit, skip) {
        logger.info(`getAllDocs from ${dbName} database`);
        
        const options = {
            include_docs: true,
            limit,
            skip,
            descending: false
        }

        try {
            const response = await this.cloudant.use(dbName).list(options);
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

    async writeDoc(dbName, doc) {
        logger.info(`writeDoc ${doc.id} to ${dbName} database`);
        this.verifyDoc(doc);
        
        try {
            const response = await this.cloudant.use(dbName)
                .insert(dbHelper.addUnderscores(doc));
            return response;
        } catch(err) {
            return dbHelper.handleError(err, 'writeDoc', doc.id);
        }
    };
    
    async putDoc (dbName, doc) {
        logger.info(`putDoc ${doc.id} from ${dbName} database`);
        this.verifyDoc(doc);

        if (!doc.rev) {
            const error = new Error('Document is missing rev');
            error.status = 400;
            throw error;
        }

        try {
            const response = await this.cloudant.use(dbName)
                .insert(dbHelper.addUnderscores(doc));
            return response;
        } catch(err) {
            return dbHelper.handleError(err, 'putDoc', doc.id);
        }
    };
    
    async deleteDocWithRev(dbName, docID, docRev) {
        logger.info(
            `deleteDoc with id ${docID} and rev ${docRev} from ${dbName} database`
        );

        return this.cloudant.use(dbName).destroy(docID, docRev);
    }

    async deleteDocWithoutRev(dbName, docID) {
        logger.info(
            `deleteDoc with id ${docID} from ${dbName} database`
        );

        const doc = await this.getDoc(dbName, docID);
        const docRev = doc.rev;

        return this.cloudant.use(dbName).destroy(docID, docRev);
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
                const err = new Error(`Document not found`);
                err.status = 404;
                throw err;
            }
            return dbHelper.handleError(err, 'deleteDoc', docID);
        }
    };
    
    // eslint-disable-next-line class-methods-use-this
    async sanitizeDoc(doc) {
        return doc;
    }

    // eslint-disable-next-line class-methods-use-this
    verifyDoc(doc) {
        if (!doc.id) {
            const error = new Error('Document is missing id');
            error.status = 400;
            throw error;
        }
    }

    async createDb(dbName, dbList, partitioned) {
        if (dbList.includes(dbName)) {
            logger.info(`Cloudant database ${dbName} already exists`);
            return;
        }
        logger.info(`Creating Cloudant database ${dbName}`);
        await this.cloudant.db.create(dbName, { partitioned });
        logger.info(`Successfully created Cloudant database ${dbName}`);
    }
}

module.exports = Cloudant;
