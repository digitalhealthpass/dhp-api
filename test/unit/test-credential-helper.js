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

const credentialHelper = require('../../helpers/credential-helper');
const schemaHelper = require('../../helpers/schema-helper');
const issuerHelper = require('../../helpers/issuer-helper');
const dbHelper = require('../../helpers/nosql-db-helper');
const keyStoreHelper = require('../../helpers/key-store-helper');
const dataFactory = require('../data-factory');
const constants = require('../../helpers/constants');
const NoSqlDB = require('../../nosql-db/nosql-db');
const KeyStore = require('../../key-store/key-store');

const { expect } = chai;
const { assert } = chai;
chai.use(chaiAsPromised);

const sandbox = sinon.createSandbox();

const { issuerId } = dataFactory;
const schemaId = dataFactory.schema._id;

const notFoundError = new Error('Not found');
notFoundError.status = 404

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

describe('test createJsonCredential()', () => {
    afterEach(() => {
        sandbox.restore();
    });

    it('happy create vaccine json credential', async () => {
        sandbox.stub(schemaHelper, 'getSchema')
            .returns(dbHelper.removeUnderscores(dataFactory.schema));
        sandbox.stub(issuerHelper, 'getKeyPair')
            .returns(dataFactory.keyPair);

        const requestBody = dataFactory.credentialRequestBody;

        const credential = await credentialHelper.createJsonCredential(
            issuerId,
            schemaId,
            requestBody.type,
            requestBody.data,
            requestBody.expirationDate
        );

        expect(credential).to.have.property('proof');
        expect(credential.obfuscation).to.be.undefined;

        const expectedCredential
            = JSON.parse(JSON.stringify(dataFactory.jsonCredential));
        delete expectedCredential.proof;
        delete expectedCredential.id;
        delete expectedCredential.issuanceDate;

        delete credential.proof;
        delete credential.id;
        delete credential.issuanceDate;

        expect(credential).to.deep.equal(expectedCredential);
    });

    it('happy create obfuscated vaccine json credential', async () => {
        sandbox.stub(schemaHelper, 'getSchema')
            .returns(dbHelper.removeUnderscores(dataFactory.schema));
        sandbox.stub(issuerHelper, 'getKeyPair')
            .returns(dataFactory.keyPair);

        const requestBody = dataFactory.credentialRequestBody;

        const obfuscation = [
            'recipient.givenName',
            'recipient.middleName',
            'recipient.familyName',
            'recipient.birthDate',
        ];

        const credential = await credentialHelper.createJsonCredential(
            issuerId,
            schemaId,
            requestBody.type,
            requestBody.data,
            requestBody.expirationDate,
            obfuscation
        )

        expect(credential).to.have.property('proof');

        const expectedCredential
            = JSON.parse(JSON.stringify(dataFactory.obfuscatedJsonCredential));

        delete expectedCredential.proof;
        delete expectedCredential.id;
        delete expectedCredential.issuanceDate;
        delete credential.proof;
        delete credential.id;
        delete credential.issuanceDate;

        for (let i = 0; i < credential.obfuscation.length; i += 1) {
            const obfuscated = credential.obfuscation[i];
            expect(obfuscated).to.have.property('nonce');
            delete obfuscated.nonce;
            delete expectedCredential.obfuscation[i].nonce;
        }

        delete credential.credentialSubject.recipient;
        delete credential.credentialSubject.recipient;

        expect(expectedCredential).to.deep.equal(expectedCredential);
    });

    it('unhappy create vaccine json credential, no matching schema', async () => {
        const requestBody = dataFactory.credentialRequestBody;

        sandbox.stub(schemaHelper, 'getSchema').throws(notFoundError);

        await expect(
            credentialHelper.createJsonCredential(
                issuerId,
                schemaId,
                requestBody.type,
                requestBody.data,
                requestBody.expirationDate
            )
        ).to.be.rejectedWith(notFoundError);
    });

    it('unhappy create vaccine json credential, key pair not found', async () => {
        sandbox.stub(schemaHelper, 'getSchema')
            .returns(dataFactory.schema);

        const error = new Error(`Issuer not onboarded`);
        sandbox.stub(issuerHelper, 'getKeyPair')
            .throws(error);

        const requestBody = dataFactory.credentialRequestBody;

        await expect(
            credentialHelper.createJsonCredential(
                issuerId,
                schemaId,
                requestBody.type,
                requestBody.data,
                requestBody.expirationDate
            )
        ).to.be.rejectedWith(error);
    });

    it('unhappy create vaccine json credential', async () => {
        sandbox.stub(schemaHelper, 'getSchema')
            .returns(dataFactory.schema);
        sandbox.stub(issuerHelper, 'getKeyPair')
            .returns(dataFactory.keyPair);

        const requestBody = dataFactory.credentialRequestBody;
        requestBody.expirationDate = '2021-09-28T15:52:47Z'

        const expectedError = new Error('Credential is expired');
        expectedError.status = 400;

        try {
            await credentialHelper.createJsonCredential(
                issuerId,
                schemaId,
                requestBody.type,
                requestBody.data,
                requestBody.expirationDate
            );
            assert.isOk(false, 'Exception was not thrown');
        } catch (error) {
            expect(error.message).to.deep.equal('Credential is expired');
            expect(error.status).to.deep.equal(400);
        }
    });
});

describe('test verifyCredential()', () => {
    beforeEach(() => {
        sandbox.stub(dbHelper, 'getInstance')
            .returns(new NoSqlDB(mockDB));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('happey verified credential', async () => {
        sandbox.stub(mockDB, 'getDoc')
            .throws(notFoundError);
        sandbox.stub(issuerHelper, 'getKeyPair')
            .returns(dataFactory.keyPair);
        sandbox.stub(issuerHelper, 'getPublicKey')
            .returns(dataFactory.issuer.publicKey[0].publicKeyJwk);

        const encodedCredential = Buffer.from(
            JSON.stringify(dataFactory.jsonCredential)
        ).toString('base64');
        const response = await credentialHelper.verifyCredential(
            encodedCredential
        );

        expect(response.valid).to.equal(true);
        expect(response.verification_status).to.equal(
            constants.CREDENTIAL_VERIFICATION_STATUS.VALID.status
        );
    });

    it('happey verified obfuscated credential', async () => {
        sandbox.stub(mockDB, 'getDoc')
            .throws(notFoundError)
        sandbox.stub(issuerHelper, 'getKeyPair')
            .returns(dataFactory.keyPair);
        sandbox.stub(issuerHelper, 'getPublicKey')
            .returns(dataFactory.issuer.publicKey[0].publicKeyJwk);

        const encodedCredential = Buffer.from(
            JSON.stringify(dataFactory.obfuscatedJsonCredential)
        ).toString('base64');
        const response = await credentialHelper.verifyCredential(
            encodedCredential
        );

        expect(response.valid).to.equal(true);
        expect(response.verification_status).to.equal(
            constants.CREDENTIAL_VERIFICATION_STATUS.VALID.status
        );
    });

    it('unhappey not encoded credential', async () => {
        sandbox.stub(mockDB, 'getDoc')
            .throws(notFoundError)
        sandbox.stub(issuerHelper, 'getKeyPair')
            .returns(dataFactory.keyPair);
        sandbox.stub(issuerHelper, 'getPublicKey')
            .returns(dataFactory.issuer.publicKey[0].publicKeyJwk);

        try {
            await credentialHelper.verifyCredential(
                issuerId, dataFactory.jsonCredential
            );
            assert.isOk(false, 'Exception was not thrown');
        } catch (error) {
            expect(error.message).to.deep.equal('Credential must be base64 encoded');
            expect(error.status).to.deep.equal(400);
        }
    });

    it('unhappey expired credential', async () => {
        sandbox.stub(mockDB, 'getDoc')
            .throws(notFoundError)
        sandbox.stub(issuerHelper, 'getKeyPair')
            .returns(dataFactory.keyPair);
        sandbox.stub(issuerHelper, 'getPublicKey')
            .returns(dataFactory.issuer.publicKey[0].publicKeyJwk);

        const encodedCredential = Buffer.from(
            JSON.stringify(dataFactory.expiredCredential)
        ).toString('base64');
        const response = await credentialHelper.verifyCredential(
            encodedCredential
        );

        expect(response.valid).to.equal(false);
        expect(response.verification_status).to.equal(
            constants.CREDENTIAL_VERIFICATION_STATUS.EXPIRED.status
        );
    });

    it('unhappey tampered credential', async () => {
        sandbox.stub(mockDB, 'getDoc')
            .throws(notFoundError)
        sandbox.stub(issuerHelper, 'getKeyPair')
            .returns(dataFactory.keyPair);
        sandbox.stub(issuerHelper, 'getPublicKey')
            .returns(dataFactory.issuer.publicKey[0].publicKeyJwk);

        const credential
            = JSON.parse(JSON.stringify(dataFactory.jsonCredential));

        credential.expirationDate = '2033-09-28T15:52:47Z';

        const encodedCredential = Buffer.from(
            JSON.stringify(credential)
        ).toString('base64');
        const response = await credentialHelper.verifyCredential(
            encodedCredential
        );

        expect(response.valid).to.equal(false);
        expect(response.verification_status).to.equal(
            constants.CREDENTIAL_VERIFICATION_STATUS.SIGNATURE_INVALID.status
        );
    });

    it('unhappey tampered obfuscation credential', async () => {
        sandbox.stub(mockDB, 'getDoc')
            .throws(notFoundError)
        sandbox.stub(issuerHelper, 'getKeyPair')
            .returns(dataFactory.keyPair);
        sandbox.stub(issuerHelper, 'getPublicKey')
            .returns(dataFactory.issuer.publicKey[0].publicKeyJwk);

        const credential
            = JSON.parse(JSON.stringify(dataFactory.obfuscatedJsonCredential));

        credential.credentialSubject.recipient.familyName = 'Smith';

        const encodedCredential = Buffer.from(
            JSON.stringify(credential)
        ).toString('base64');
        const response = await credentialHelper.verifyCredential(
            encodedCredential
        );

        expect(response.valid).to.equal(false);
        expect(response.verification_status).to.equal(
            constants.CREDENTIAL_VERIFICATION_STATUS.DEOBFUSCATION_FAILED.status
        );
    });

    it('unhappey revoked credential', async () => {
        sandbox.stub(issuerHelper, 'getKeyPair')
            .returns(dataFactory.keyPair);
        sandbox.stub(issuerHelper, 'getPublicKey')
            .returns(dataFactory.issuer.publicKey[0].publicKeyJwk);

        const credential
            = JSON.parse(JSON.stringify(dataFactory.jsonCredential));

        credential.credentialSubject.recipient.familyName = 'Smith';

        const encodedCredential = Buffer.from(
            JSON.stringify(credential)
        ).toString('base64');
        const response = await credentialHelper.verifyCredential(
            encodedCredential
        );

        expect(response.valid).to.equal(false);
        expect(response.verification_status).to.equal(
            constants.CREDENTIAL_VERIFICATION_STATUS.REVOKED.status
        );
    });
});

describe('test revokeCredential()', () => {
    beforeEach(() => {
        sandbox.stub(dbHelper, 'getInstance')
            .returns(new NoSqlDB(mockDB));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Happy revoked credential', async () => {
        sandbox.spy(mockDB);

        const revoke = {
            id: "revokeId",
            reason: "revoked reason"
        };

        credentialHelper.revokeCredential(issuerId, revoke);

        expect(mockDB.writeDoc.calledOnce).to.be.true;
        expect(mockDB.writeDoc.getCall(0).args[0])
            .to.equal(constants.NOSQL_CONTAINER_ID.REVOKED_CREDENTIAL);
        expect(mockDB.writeDoc.getCall(0).args[1])
            .to.deep.equal(revoke);
    });
});

describe('test getRevokedCredential()', () => {
    beforeEach(() => {
        sandbox.stub(dbHelper, 'getInstance')
            .returns(new NoSqlDB(mockDB));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Happy get revoked credential', async () => {
        sandbox.spy(mockDB);

        const did = 'did:dhp:1234';

        credentialHelper.getRevokedCredential(
            constants.NOSQL_CONTAINER_ID.REVOKED_CREDENTIAL, did
        );

        expect(mockDB.getDoc.calledOnce).to.be.true;

        expect(mockDB.getDoc.getCall(0).args[0])
            .to.equal(constants.NOSQL_CONTAINER_ID.REVOKED_CREDENTIAL);

        expect(mockDB.getDoc.getCall(0).args[1])
            .to.equal(did);
    });
});


describe('test getAllRevokedCredentials()', () => {
    beforeEach(() => {
        sandbox.stub(dbHelper, 'getInstance')
            .returns(new NoSqlDB(mockDB));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Happy get all revoked credential', async () => {
        sandbox.spy(mockDB);

        credentialHelper.getAllRevokedCredentials(1, 2);

        expect(mockDB.getAllRevokedCredentials.calledOnce).to.be.true;

        expect(mockDB.getAllRevokedCredentials.getCall(0).args[0])
            .to.equal(1);

        expect(mockDB.getAllRevokedCredentials.getCall(0).args[1])
            .to.equal(2);
    });
});

describe('test validateVcCredentialData()', async () => {
    afterEach(() => {
        sandbox.restore();
    });

    it('Happy validate VC credential data', async () => {
        const encodedCredential = Buffer.from(
            JSON.stringify(dataFactory.vcLoginCredential)
        ).toString('base64');

        const { credSchemaId, credIssuerDID, id }
            = await credentialHelper.validateVcCredentialData(encodedCredential);

        expect(credSchemaId).to.equal(
            dataFactory.vcLoginCredential.credentialSchema.id
        );
        expect(credIssuerDID).to.equal(dataFactory.schema.author);

        const expectedCredId = dataFactory.vcLoginCredential.id.split(';')[1];

        expect(id).to.equal(expectedCredId);
    });

    it('unhappy validate VC credential data with validatioin error', async () => {
        const credential = JSON.parse(JSON.stringify(dataFactory.vcLoginCredential));

        delete credential.id;

        const encodedCredential = Buffer.from(
            JSON.stringify(credential)
        ).toString('base64');

        try {
            await credentialHelper.validateVcCredentialData(encodedCredential);
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(
                'Supplied credential is not in hpass credentials format'
            );
            expect(err.status).to.equal(400);
        }
    });

    it('unhappy validate VC credential data with missing expiration date',
        async () => {
            const credential = JSON.parse(JSON.stringify(dataFactory.vcLoginCredential));

            delete credential.expirationDate;

            const encodedCredential = Buffer.from(
                JSON.stringify(credential)
            ).toString('base64');

            try {
                await credentialHelper.validateVcCredentialData(encodedCredential);
                assert.isOk(false, 'Exception was not thrown');
            } catch (err) {
                expect(err.message).to.equal(
                    'Supplied credential is missing expirationDate'
                );
                expect(err.status).to.equal(400);
            }
        });

    it('unhappy validate VC credential data expired',
        async () => {
            const credential = JSON.parse(JSON.stringify(dataFactory.vcLoginCredential));

            credential.expirationDate = '2021-01-01T00:00:00Z';

            const encodedCredential = Buffer.from(
                JSON.stringify(credential)
            ).toString('base64');

            try {
                await credentialHelper.validateVcCredentialData(encodedCredential);
                assert.isOk(false, 'Exception was not thrown');
            } catch (err) {
                expect(err.message).to.equal(
                    'Supplied credential is expired'
                );
                expect(err.status).to.equal(401);
            }
        });
});


describe('test validateVcIssuerDID()', async () => {
    beforeEach(() => {
        sandbox.stub(keyStoreHelper, 'getInstance')
            .returns(new KeyStore(mockKeystore));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Happy vc issuer DID', async () => {
        const credential = dataFactory.vcLoginCredential;
        const credIssuerDID = credential.issuer;
        const credSchemaId = credential.credentialSchema.id;
        const credId = credential.id.split(';')[1]

        sandbox.stub(mockKeystore, 'getSecret')
            .returns(dataFactory.keyPair);

        await credentialHelper.validateVcIssuerDID(
            credSchemaId, credIssuerDID, credId
        );
    });

    it('unhappy validate vc issuer DID - getIssuerDID throws exception',
        async () => {
            sandbox.stub(issuerHelper, 'getIssuerDID')
                .throws(notFoundError);

            const credential = dataFactory.vcLoginCredential;
            const credIssuerDID = credential.issuer;
            const credSchemaId = credential.credentialSchema.id;
            const credId = credential.id.split(';')[1]

            try {
                await credentialHelper.validateVcIssuerDID(
                    credSchemaId, credIssuerDID, credId
                );
                assert.isOk(false, 'Exception was not thrown');
            } catch (err) {
                expect(err.message).to.equal(
                    'Verifiable Credential processing error'
                );
                expect(err.status).to.equal(404);
            }
        });

    it('unhappy validate vc issuer DID - bad schema id',
        async () => {
            const credential = dataFactory.vcLoginCredential;
            const credIssuerDID = credential.issuer;
            const credSchemaId = 'did:1234';
            const credId = credential.id.split(';')[1]

            try {
                await credentialHelper.validateVcIssuerDID(
                    credSchemaId, credIssuerDID, credId
                );
                assert.isOk(false, 'Exception was not thrown');
            } catch (err) {
                expect(err.message).to.equal(
                    'Verifiable Credential is not authorized'
                );
                expect(err.status).to.equal(401);
            }
        });

    it('unhappy validate vc issuer DID - wrong issuer DID',
        async () => {
            sandbox.stub(mockKeystore, 'getSecret')
                .returns(dataFactory.keyPair.creator);

            const credential = dataFactory.vcLoginCredential;
            const credIssuerDID = 'did:1234';
            const credSchemaId = credential.credentialSchema.id;
            const credId = credential.id.split(';')[1]

            try {
                await credentialHelper.validateVcIssuerDID(
                    credSchemaId, credIssuerDID, credId
                );
                assert.isOk(false, 'Exception was not thrown');
            } catch (err) {
                expect(err.message).to.equal(
                    'Verifiable Credential is not authorized'
                );
                expect(err.status).to.equal(401);
            }
        });
});

