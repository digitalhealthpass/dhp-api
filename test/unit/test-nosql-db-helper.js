// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

/* eslint-disable no-empty-function */
/* eslint-disable class-methods-use-this */
/* eslint-disable node/no-unpublished-require */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-classes-per-file */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const dbHelper = require('../../helpers/nosql-db-helper');
const NoSqlDB = require('../../nosql-db/nosql-db');
const Cloudant = require('../../nosql-db/cloudant');
const CosmosDB = require('../../nosql-db/cosmos-db');
const CouchDB = require('../../nosql-db/couchdb');

const { expect } = chai;
const { assert } = chai;
chai.use(chaiAsPromised);

describe('test NoSql DB helper', () => {
    it('happy init cloudant', () => {
        process.env.NOSQL_DB_FILE_NAME = 'cloudant.js';
        dbHelper.init();
        const instance = dbHelper.getInstance();

        expect(instance).to.be.an.instanceOf(NoSqlDB);
        expect(instance.instance).to.be.an.instanceOf(Cloudant);
    });

    it('happy init cosmos db', () => {
        process.env.NOSQL_DB_FILE_NAME = 'cosmos-db.js';
        dbHelper.init();
        const instance = dbHelper.getInstance();

        expect(instance).to.be.an.instanceOf(NoSqlDB);
        expect(instance.instance).to.be.an.instanceOf(CosmosDB);
    });

    it('happy init CouchDb', () => {
        process.env.NOSQL_DB_FILE_NAME = 'couchdb.js';
        dbHelper.init();
        const instance = dbHelper.getInstance();

        expect(instance).to.be.an.instanceOf(NoSqlDB);
        expect(instance.instance).to.be.an.instanceOf(CouchDB);
    });

    it('unhappy init unknown db', () => {
        process.env.NOSQL_DB_FILE_NAME = 'unknown.js';
        
        try {
            dbHelper.init();
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.include(
                'Unable to load NoSQL DB helper file unknown.js'
            );
        }
    });
});

describe('test removeUnderscores()', () => {
    it('happy remove underscores', () => {
        const doc = {
            _id: 'id',
            _rev: 'rev'
        }
        const newDoc = dbHelper.removeUnderscores(doc);
        expect(newDoc).to.deep.equal({
            id: 'id',
            rev: 'rev'
        });
    });
});

describe('test addUnderscores()', () => {
    it('happy add underscores', () => {
        const doc = {
            id: 'id',
            rev: 'rev'
        }
        const newDoc = dbHelper.addUnderscores(doc);
        expect(newDoc).to.deep.equal({
            _id: 'id',
            _rev: 'rev'
        });
    });
});

describe('test verifyDoc()', () => {
    it('happy verify doc', () => {
        const doc = {
            id: 'id',
            rev: 'rev'
        }
        dbHelper.verifyDoc(doc);
    });

    it('unhappy verify doc', () => {
        const doc = {
            rev: 'rev'
        }

        try {
            dbHelper.verifyDoc(doc);
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(
                `Document is missing id`
            );
            expect(err.status).to.equal(400);
        }
    });
});

describe('test handleError()', () => {
    it('happy handle error', () => {
        const error = new Error('Not found');
        error.status = 404;

        try {
            dbHelper.handleError(error, 'method', 'docId');
        } catch (err) {
            expect(err.message).to.deep.equal(
                'Method: method; Doc ID: docId; Error: Not found'
            );
            expect(err.status).to.equal(404);
        }
    });
});
