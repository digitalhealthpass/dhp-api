// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

/* eslint-disable no-empty-function */
/* eslint-disable class-methods-use-this */
/* eslint-disable node/no-unpublished-require */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-classes-per-file */

const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const schemaHelper = require('../../helpers/schema-helper');
const dbHelper = require('../../helpers/nosql-db-helper');
const keyStoreHelper = require('../../helpers/key-store-helper');
const dataFactory = require('../data-factory');
const NoSqlDB = require('../../nosql-db/nosql-db');
const KeyStore = require('../../key-store/key-store');

const { expect } = chai;
const { assert } = chai;
chai.use(chaiAsPromised);

const sandbox = sinon.createSandbox();

const notFoundError = new Error('Not found');
notFoundError.status = 404;

const error400 = new Error('400 error');
error400.status = 400;

class MockDB extends NoSqlDB {
    async getDoc() { }

    async writeDoc() { }

    async sanitizeDoc() { }
}

class MockKeyStore extends KeyStore {
    async getSecret() { }

    async saveSecret() { }
}

const mockDB = new MockDB();
const mockKeystore = new MockKeyStore();

const { issuerId } = dataFactory;

describe('test getSchema()', () => {
    beforeEach(() => {
        sandbox.stub(dbHelper, 'getInstance')
            .returns(new NoSqlDB(mockDB));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('happy get schema', async () => {
        const { schema } = dataFactory;

        sandbox.stub(mockDB, 'getDoc')
            .returns(schema);

        sandbox.stub(mockDB, 'sanitizeDoc')
            .returns(schema);

        const response = await schemaHelper.getSchema('did:dhp:1234');

        expect(response).to.deep.equal(schema);
    });

    it('unhappy get schema, not found', async () => {
        sandbox.stub(mockDB, 'getDoc')
            .throws(notFoundError);

        try {
            await schemaHelper.getSchema('did:dhp:1234');
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal('Schema not found');
            expect(err.status).to.equal(404);
        }
    });

    it('unhappy get schema, 400', async () => {
        sandbox.stub(mockDB, 'getDoc')
            .throws(error400);

        try {
            await schemaHelper.getSchema('did:dhp:1234');
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal('400 error');
            expect(err.status).to.equal(400);
        }
    });
});

describe('test getAllSchemas()', () => {
    beforeEach(() => {
        sandbox.stub(dbHelper, 'getInstance')
            .returns(new NoSqlDB(mockDB));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('happy get all schemas', async () => {
        const { schema } = dataFactory;

        sandbox.stub(mockDB, 'getAllSchemas')
            .returns([schema]);

        const response = await schemaHelper.getAllSchemas(0, 0);

        expect(response[0]).to.deep.equal(schema);
    });

    it('unhappy get all schemas, not found', async () => {
        sandbox.stub(mockDB, 'getAllSchemas')
            .throws(notFoundError);

        try {
            await schemaHelper.getAllSchemas(0, 0);
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal('No schemas found');
            expect(err.status).to.equal(404);
        }
    });

    it('unhappy get all schemas, 400', async () => {
        sandbox.stub(mockDB, 'getAllSchemas')
            .throws(error400);

        try {
            await schemaHelper.getAllSchemas(0, 0);
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal('400 error');
            expect(err.status).to.equal(400);
        }
    });
});

describe('test createSchema()', () => {
    beforeEach(() => {
        sandbox.stub(dbHelper, 'getInstance')
            .returns(new NoSqlDB(mockDB));
        sandbox.stub(keyStoreHelper, 'getInstance')
            .returns(new KeyStore(mockKeystore));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('happy create schema', async () => {
        sandbox.stub(mockKeystore, 'getSecret')
            .returns(dataFactory.keyPair);
        sandbox.stub(mockDB, 'writeDoc').returnsArg(1);
        sandbox.stub(mockDB, 'sanitizeDoc').returnsArg(0);


        const savedSchema = await schemaHelper
            .createSchema(issuerId, dataFactory.createSchemaBody);

        expect(savedSchema.proof).to.not.be.undefined;
        expect(savedSchema.schema).to.deep
            .equal(dataFactory.createSchemaBody.schema);
    });

    it('unhappy create schema, unknown issuer', async () => {
        sandbox.stub(mockKeystore, 'getSecret')
            .throws(notFoundError);

        try {
            await schemaHelper
                .createSchema(issuerId, dataFactory.createSchemaBody);
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal('Unknown issuer id');
            expect(err.status).to.equal(404);
        }
    });

    it('unhappy create schema, 400 error', async () => {
        sandbox.stub(mockKeystore, 'getSecret')
            .throws(error400);

        try {
            await schemaHelper
                .createSchema(issuerId, dataFactory.createSchemaBody);
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal('400 error');
            expect(err.status).to.equal(400);
        }
    });
});
