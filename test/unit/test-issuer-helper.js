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

const issuerHelper = require('../../helpers/issuer-helper');
const dbHelper = require('../../helpers/nosql-db-helper');
const encryptionHelper = require('../../helpers/encryption-helper');
const keystoreHelper = require('../../helpers/key-store-helper');
const KeyStore = require('../../key-store/key-store');
const NoSqlDB = require('../../nosql-db/nosql-db');
const utils = require('../../utils');
const dataFactory = require('../data-factory');

const { assert } = chai;
const { expect } = chai;
chai.use(chaiAsPromised);

const sandbox = sinon.createSandbox();

const { issuerId } = dataFactory;

class MockDB extends NoSqlDB {
    async getDoc() { }

    async writeDoc() { }

    async sanitizeDoc() { }
}

class MockKeyStore extends KeyStore {
    async getSecret() { }

    async saveSecret() { }
}

const notFoundError = new Error('Not found');
notFoundError.status = 404;

const error400 = new Error('400 error');
error400.status = 400;

const mockDB = new MockDB();
const mockKeystore = new MockKeyStore();

describe('test createIssuer()', () => {
    beforeEach(() => {
        sandbox.stub(dbHelper, 'getInstance')
            .returns(new NoSqlDB(mockDB));
        sandbox.stub(keystoreHelper, 'getInstance')
            .returns(new KeyStore(mockKeystore));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('happy create issuer', async () => {
        sandbox.spy(mockDB, 'writeDoc');
        sandbox.spy(mockDB, 'sanitizeDoc');
        sandbox.spy(mockKeystore, 'saveSecret');
        sandbox.spy(encryptionHelper, 'keyPairFromPems');
        sandbox.spy(utils, 'createDid');

        const { keys } = dataFactory.keyPair;

        await issuerHelper.createIssuer(
            keys[0], keys[0], 'did:dhp', issuerId, 'http://localhost'
        );

        assert(mockDB.writeDoc.calledOnce);
        assert(mockDB.sanitizeDoc.calledOnce);
        assert(mockKeystore.saveSecret.calledOnce);
        assert(encryptionHelper.keyPairFromPems.calledOnce);
        assert(utils.createDid.calledOnce);
    });

    it('happy create issuer - key pair exists but not issuer',
        async () => {
            sandbox.stub(mockDB, 'getDoc')
                .throws(notFoundError);

            sandbox.stub(mockKeystore, 'getSecret')
                .returns(dataFactory.keyPair);


            sandbox.spy(mockDB, 'writeDoc');
            sandbox.spy(mockDB, 'sanitizeDoc');
            sandbox.spy(mockKeystore, 'saveSecret');
            sandbox.spy(encryptionHelper, 'keyPairFromPems');
            sandbox.spy(utils, 'createDid');

            const { keys } = dataFactory.keyPair;

            await issuerHelper.createIssuer(
                keys[0], keys[0], 'did:dhp', issuerId, 'http://localhost'
            );

            assert(mockDB.writeDoc.calledOnce);
            assert(mockDB.sanitizeDoc.calledOnce);
            assert(mockKeystore.saveSecret.calledOnce);

            assert(encryptionHelper.keyPairFromPems.notCalled);
            assert(utils.createDid.notCalled);
        });

    it('unhappy create issuer - issuer already exists',
        async () => {
            sandbox.stub(mockDB, 'getDoc')
                .returns(dataFactory.issuer);
            sandbox.stub(mockKeystore, 'getSecret')
                .returns(dataFactory.keyPair);


            const { keys } = dataFactory.keyPair;

            try {
                await issuerHelper.createIssuer(
                    keys[0], keys[0], 'did:dhp', issuerId, 'http://localhost'
                );
            } catch (err) {
                expect(err.message).to.equal(
                    `Issuer ${issuerId} already exists`
                );
                expect(err.status).to.equal(409);
                return;
            }
            assert.isOk(false, 'Exception was not thrown');
        });
});

describe('test getKeyPair()', () => {
    beforeEach(() => {
        sandbox.stub(keystoreHelper, 'getInstance')
            .returns(new KeyStore(mockKeystore));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('happy get key pair', async () => {
        sandbox.stub(mockKeystore, 'getSecret')
            .returns(dataFactory.keyPair);

        const keyPair = await issuerHelper.getKeyPair(issuerHelper);

        expect(keyPair).to.deep.equal(dataFactory.keyPair);
    });

    it('happy get key pair, not found', async () => {
        sandbox.stub(mockKeystore, 'getSecret')
            .throws(notFoundError);

        const keyPair = await issuerHelper.getKeyPair(issuerHelper);

        expect(keyPair).to.be.undefined;
    });

    it('unhappy get key pair, 400 error', async () => {
        sandbox.stub(mockKeystore, 'getSecret')
            .throws(error400);

        try {
            await issuerHelper.getKeyPair(issuerHelper);
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal('400 error');
            expect(err.status).to.equal(400);
        }
    });


    describe('test getPublicKeys()', () => {
        beforeEach(() => {
            sandbox.stub(dbHelper, 'getInstance')
                .returns(new NoSqlDB(mockDB));
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('happy get public keys', async () => {
            sandbox.stub(mockDB, 'getAllPublicKeys')
                .returns([dataFactory.issuer]);

            const publicKeys = await issuerHelper.getPublicKeys(0, 0);
            expect(publicKeys[0]).to.deep.equal(dataFactory.issuer);
        });

        it('happy get public keys, not found', async () => {
            sandbox.stub(mockDB, 'getAllPublicKeys')
                .throws(notFoundError);

            const publicKeys = await issuerHelper.getPublicKeys(0, 0);
            expect(publicKeys).to.deep.equal([]);
        });

        it('unhappy get public keys, 400 error', async () => {
            sandbox.stub(mockDB, 'getAllPublicKeys')
                .throws(error400);

            try {
                await issuerHelper.getPublicKeys(0, 0);
                assert.isOk(false, 'Exception was not thrown');
            } catch (err) {
                expect(err.message).to.equal(error400.message);
                expect(err.status).to.equal(error400.status);
            }
        });
    });
});

describe('test getPublicKey()', () => {
    beforeEach(() => {
        sandbox.stub(dbHelper, 'getInstance')
            .returns(new NoSqlDB(mockDB));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('happy get public key', async () => {
        sandbox.stub(mockDB, 'getDoc')
            .returns(dataFactory.issuer);

        const publicKey = await issuerHelper.getPublicKey(0, 0);
        expect(publicKey).to.deep.equal(dataFactory.issuer);
    });

    it('happy get public key, not found', async () => {
        sandbox.stub(mockDB, 'getDoc')
            .throws(notFoundError);

        const publicKey = await issuerHelper.getPublicKey(0, 0);
        expect(publicKey).to.be.undefined;
    });

    it('unhappy get public key, 400 error', async () => {
        sandbox.stub(mockDB, 'getDoc')
            .throws(error400);

        try {
            await issuerHelper.getPublicKey(0, 0);
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(error400.message);
            expect(err.status).to.equal(error400.status);
        }
    });
});

describe('test updateMetadata()', () => {
    beforeEach(() => {
        sandbox.stub(dbHelper, 'getInstance')
            .returns(new NoSqlDB(mockDB));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('happy update metadata, no existing metadata', async () => {
        const metadata = {
            id: 'did:dhp:123'
        };

        const callback = sandbox.stub(mockDB, 'getDoc');
        callback.onCall(0).returns(dataFactory.issuer);
        callback.onCall(1).throws(notFoundError);

        sandbox.stub(mockDB, 'sanitizeDoc').returns(metadata);

        sandbox.spy(mockDB, 'writeDoc');
        sandbox.spy(mockDB, 'putDoc');

        const returnedMetadata = await issuerHelper.updateMetadata(
            'did:dhp:123', metadata
        );

        expect(returnedMetadata).to.deep.equal(metadata);
        assert(mockDB.writeDoc.calledOnce);
        assert(mockDB.putDoc.notCalled);
    });

    it('happy update metadata, existing metadata', async () => {
        const metadata = {
            id: 'did:dhp:123'
        };

        const callback = sandbox.stub(mockDB, 'getDoc');
        callback.onCall(0).returns(dataFactory.issuer);
        callback.onCall(1).returns(metadata);

        sandbox.stub(mockDB, 'sanitizeDoc').returns(metadata);

        sandbox.stub(mockDB, 'putDoc');

        sandbox.spy(mockDB, 'writeDoc');

        const returnedMetadata = await issuerHelper.updateMetadata(
            'did:dhp:123', metadata
        );

        expect(returnedMetadata).to.deep.equal(metadata);
        assert(mockDB.putDoc.calledOnce);
        assert(mockDB.writeDoc.notCalled);
    });

    it('unhappy update metadata, issuer not found', async () => {
        const metadata = {
            id: 'did:dhp:123'
        };

        sandbox.stub(mockDB, 'getDoc')
            .throws(notFoundError);

        try {
            await issuerHelper.updateMetadata(
                'did:dhp:123', metadata
            );
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(
                'Issuer did did:dhp:123 not found'
            );
            expect(err.status).to.equal(404);
        }
    });

    it('unhappy update metadata, 400 thrown getting issuer', async () => {
        const metadata = {
            id: 'did:dhp:123'
        };

        sandbox.stub(mockDB, 'getDoc')
            .throws(error400);

        try {
            await issuerHelper.updateMetadata(
                'did:dhp:123', metadata
            );
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(
                '400 error'
            );
            expect(err.status).to.equal(400);
        }
    });

    it('unhappy update metadata, 400 thrown putting doc', async () => {
        const metadata = {
            id: 'did:dhp:123'
        };

        const callback = sandbox.stub(mockDB, 'getDoc');
        callback.onCall(0).returns(dataFactory.issuer);
        callback.onCall(1).returns(metadata);

        sandbox.stub(mockDB, 'putDoc')
            .throws(error400);

        try {
            await issuerHelper.updateMetadata(
                'did:dhp:123', metadata
            );
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(
                '400 error'
            );
            expect(err.status).to.equal(400);
        }
    });

    it('unhappy update metadata, 400 thrown writing doc', async () => {
        const metadata = {
            id: 'did:dhp:123'
        };

        const callback = sandbox.stub(mockDB, 'getDoc');
        callback.onCall(0).returns(dataFactory.issuer);
        callback.onCall(1).throws(notFoundError);

        sandbox.stub(mockDB, 'writeDoc')
            .throws(error400);

        try {
            await issuerHelper.updateMetadata(
                'did:dhp:123', metadata
            );
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(
                '400 error'
            );
            expect(err.status).to.equal(400);
        }
    });
});

describe('test getIssuerMetadata()', () => {
    beforeEach(() => {
        sandbox.stub(dbHelper, 'getInstance')
            .returns(new NoSqlDB(mockDB));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('happy get issuer metadata', async () => {
        const metadata = {
            id: 'did:dhp:123'
        };
        sandbox.stub(mockDB, 'getDoc')
            .returns(metadata);

        const response = await issuerHelper.getIssuerMetadata();

        expect(response).to.deep.equal(metadata);
    });

    it('happy get issuer metadata, not found', async () => {
        sandbox.stub(mockDB, 'getDoc')
            .throws(notFoundError);

        const response = await issuerHelper.getIssuerMetadata();

        expect(response).to.be.undefined;
    });

    it('happy get issuer metadata, 400 thrown', async () => {
        sandbox.stub(mockDB, 'getDoc')
            .throws(error400);

        try {
            await issuerHelper.getIssuerMetadata();
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal('400 error');
            expect(err.status).to.equal(400);
        }
    });
});

describe('test rotateIssuerKeys()', () => {
    beforeEach(() => {
        sandbox.stub(dbHelper, 'getInstance')
            .returns(new NoSqlDB(mockDB));
        sandbox.stub(keystoreHelper, 'getInstance')
            .returns(new KeyStore(mockKeystore));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('happy rotate issuer keys', async () => {
        sandbox.stub(mockKeystore, 'getSecret')
            .returns(dataFactory.keyPair);

        sandbox.stub(mockKeystore, 'updateSecret');

        const getDocCallback = sandbox.stub(mockDB, 'getDoc')
        getDocCallback.onCall(0).returns(dataFactory.issuer);

        sandbox.stub(mockDB, 'putDoc');

        const publicPem = dataFactory.createIssuerBody.public_key_cert;
        const privatePem = dataFactory.createIssuerBody.private_key_cert;

        await issuerHelper.rotateIssuerKeys(publicPem, privatePem, issuerId);

        assert(mockKeystore.updateSecret.calledOnce);
        assert(mockDB.putDoc.calledOnce);

        const saveSecretArgs = mockKeystore.updateSecret.getCall(0).args;

        const keyPairKey = saveSecretArgs[0];
        const newKeyPair = saveSecretArgs[1];

        expect(keyPairKey).to.equal(`${issuerId}-kp`);
        expect(newKeyPair.keys).to.be.not.undefined;
        expect(newKeyPair.keys.length).be.equal(2);
        expect(newKeyPair.version).be.equal(2);

        const dbPutDocArgs = mockDB.putDoc.getCall(0).args;

        const updatedIssuer = dbPutDocArgs[1];

        expect(updatedIssuer.publicKey.length).to.equal(2);
        expect(updatedIssuer.publicKey[1].publicKeyJwk)
            .to.deep.equal(newKeyPair.keys[0]);
    });

    it('unhappy rotate issuer keys, unknown issuer', async () => {
        sandbox.stub(mockKeystore, 'getSecret')
            .throws(notFoundError);


        const publicPem = dataFactory.createIssuerBody.public_key_cert;
        const privatePem = dataFactory.createIssuerBody.private_key_cert;

        try {
            await issuerHelper.rotateIssuerKeys(publicPem, privatePem, issuerId);
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(`Issuer ${issuerId} is not onboarded`);
            expect(err.status).to.equal(404);
        }
    });

    it('unhappy rotate issuer keys, 400 error', async () => {
        sandbox.stub(mockKeystore, 'getSecret')
            .throws(error400);


        const publicPem = dataFactory.createIssuerBody.public_key_cert;
        const privatePem = dataFactory.createIssuerBody.private_key_cert;

        try {
            await issuerHelper.rotateIssuerKeys(publicPem, privatePem, issuerId);
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(`400 error`);
            expect(err.status).to.equal(400);
        }
    });
});

describe('test getIssuerDID()', () => {
    beforeEach(() => {
        sandbox.stub(keystoreHelper, 'getInstance')
            .returns(new KeyStore(mockKeystore));
    });

    it('happy get issuer DID', async () => {
        sandbox.stub(mockKeystore, 'getSecret')
            .returns(dataFactory.keyPair);

        const did = await issuerHelper.getIssuerDID(issuerId);

        expect(did).to.equal(dataFactory.keyPair.creator);
    });

    it('unhappy get issuer DID, 400 error', async () => {
        sandbox.stub(mockKeystore, 'getSecret')
            .throws(error400);

        try {
            await issuerHelper.getIssuerDID(issuerId);
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(
                `Unable to get issuer did for ${issuerId}: 400 error`
            );
            expect(err.status).to.equal(400);
        }
    });

    afterEach(() => {
        sandbox.restore();
    });
});

