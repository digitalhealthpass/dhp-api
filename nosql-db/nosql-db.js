// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

class NoSqlDB {
    constructor(instance) {
        if (instance) {
            if (!(instance instanceof NoSqlDB)) {
                throw new Error(`Instance parameter must inherent from NoSqlDB`);
            }

            this.instance = instance;
        }
    }

    async init(args) {
        this.verifyInstance('init');
        await this.instance.init(args);
    }
    
    async getDoc(containerId, docID) {
        this.verifyInstance('getDoc');
        return this.instance.getDoc(containerId, docID);
    };

    async getAllDocs(containerId, limit, skip) {
        this.verifyInstance('getDoc');
        return this.instance.getAllDocs(containerId, limit, skip);
    }

    async getAllRevokedCredentials(limit, skip) {
        this.verifyInstance('getAllRevokedCredentials');
        return this.instance.getAllRevokedCredentials(limit, skip);
    }

    async getAllSchemas(limit, skip) {
        this.verifyInstance('getAllSchemas');
        return this.instance.getAllSchemas(limit, skip);
    }

    async getAllPublicKeys(limit, skip) {
        this.verifyInstance('getAllPublicKeys');
        return this.instance.getAllPublicKeys(limit, skip);
    }
    
    async writeDoc(containerId, doc) {
        this.verifyInstance('writeDoc');
        return this.instance.writeDoc(containerId, doc);
    };
    
    async putDoc (containerId, doc) {
        this.verifyInstance('putDoc');
        return this.instance.putDoc(containerId, doc);
    };
    
    async deleteDoc (containerId, docID, docRev) {
        this.verifyInstance('deleteDoc');
        return this.instance.deleteDoc(containerId, docID, docRev);
    };
    
    async sanitizeDoc(doc) {
        this.verifyInstance('sanitizeDoc');
        return this.instance.sanitizeDoc(doc);
    }

    verifyInstance(methodName) {
        if (!this.instance) {
            throw new Error(
                `A NoSqlDB instance must be passed to the constructor to invoke methods`
            );
        }
        if(typeof this.instance[methodName] !== 'function') {
            throw new Error(`${methodName}() method must be implemented`);
        }
    }
}

module.exports = NoSqlDB;
