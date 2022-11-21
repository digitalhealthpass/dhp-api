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
const CryptoJS = require("crypto-js");

const dataFactory = require('../data-factory');
const encryptionHelper = require('../../helpers/encryption-helper');

const { expect } = chai;
const { assert } = chai;
chai.use(chaiAsPromised);

describe('test keyPairFromPems()', () => {
    // eslint-disable-next-line max-len
    const publicPem = '-----BEGIN CERTIFICATE-----\nMIIBCTCBsAIJAIyxl50b0PpzMAoGCCqGSM49BAMCMA0xCzAJBgNVBAYTAlVTMB4X\nDTIyMDkyNzE0MjAwN1oXDTMyMDkyNDE0MjAwN1owDTELMAkGA1UEBhMCVVMwWTAT\nBgcqhkjOPQIBBggqhkjOPQMBBwNCAASAioIV07iSGdSQd51yTaq4l7OW/g0seNxd\nlfH8dlx+gTFRYQTWkESHrtIbFKhfQGp9yY4Zj93Lo3yoQIaVj4P+MAoGCCqGSM49\nBAMCA0gAMEUCICuw9SDwiW5PTISM+GcbCg5OXmWYk6xWE9xs0bnFrZTtAiEA4/8c\nftBK5gaTCjZuJCqhI1FNfXja9C6I3k2CuSfU6Rg=\n-----END CERTIFICATE-----';
    // eslint-disable-next-line max-len
    const privatePem = '-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIFiY3JIj9WbdTjNB0NFFTp4E0lsRGTYzzU+sK9hd4BnhoAoGCCqGSM49\nAwEHoUQDQgAEgIqCFdO4khnUkHedck2quJezlv4NLHjcXZXx/HZcfoExUWEE1pBE\nh67SGxSoX0BqfcmOGY/dy6N8qECGlY+D/g==\n-----END EC PRIVATE KEY-----';

    it('happy key pair from pems', async () => {
        const keyPair = await encryptionHelper.keyPairFromPems(
            publicPem, privatePem
        );

        expect(keyPair).to.have.property('keys');
        expect(keyPair.keys.length).to.equal(2);
    });
});

describe('test generateKeyPair()', () => {
    it('happy generate key pair', () => {
        const keyPair = encryptionHelper.generateKeyPair();

        expect(keyPair).to.have.property('publicPem');
        expect(keyPair).to.have.property('privatePem');

        assert.include(
            keyPair.publicPem,
            'BEGIN PUBLIC KEY',
            'Public key contains BEGIN PUBLIC KEY'
        );

        assert.include(
            keyPair.publicPem,
            'END PUBLIC KEY',
            'Public key contains END PUBLIC KEY'
        );

        assert.include(
            keyPair.privatePem,
            'BEGIN PRIVATE KEY',
            'Public key contains BEGIN PRIVATE KEY'
        );

        assert.include(
            keyPair.privatePem,
            'END PRIVATE KEY',
            'Public key contains END PRIVATE KEY'
        );
    });
});

describe('test signCredential()', () => {
    it('happy sign credential', () => {
        const unsignedCredential = JSON.parse(
            JSON.stringify(dataFactory.jsonCredential)
        );

        const { keyPair } = dataFactory;
        const publicKey = keyPair.keys[0];
        const privateKey = keyPair.keys[1];

        delete unsignedCredential.proof;

        const signedCredential = encryptionHelper.signCredential(
            privateKey, publicKey, unsignedCredential
        );

        expect(signedCredential).to.have.property('proof');
        expect(signedCredential.proof).to.have.property('created');
        expect(signedCredential.proof).to.have.property('creator');

        expect(signedCredential.proof.creator).to.have.property('crv');
        expect(signedCredential.proof.creator).to.have.property('kid');
        expect(signedCredential.proof.creator).to.have.property('kty');
        expect(signedCredential.proof.creator).to.have.property('x');
        expect(signedCredential.proof.creator).to.have.property('x5t');
        expect(signedCredential.proof.creator).to.have.property('y');

        expect(signedCredential.proof).to.have.property('nonce');
        expect(signedCredential.proof).to.have.property('type');
        expect(signedCredential.proof).to.have.property('signatureValue');

        expect(signedCredential.proof.creator.crv).to.equal('P-256');
        expect(signedCredential.proof.creator.kty).to.equal('EC');
        expect(signedCredential.proof.type).to.equal('EcdsaSecp256r1Signature2019');
    });
});

describe('test verifyCredential()', () => {
    it('happy verify credential', () => {
        const credential = dataFactory.jsonCredential;
        const { keyPair } = dataFactory;

        const result = encryptionHelper.verifyCredential(
            keyPair.keys[0],
            credential
        );
        expect(result).to.be.true;
    });

    it('unhappy verify credential - wrong public key', () => {
        const credential = dataFactory.jsonCredential;
        const wrongPublicKey = {
            "kty": "EC",
            "kid": "3Tgm0sVNNPf9fCLUDAH2EUCG5jZun90e099Utwlxn6Y",
            "x5t": "J7qgSpqoE4FIaTY3v3B2uGShUFo",
            "crv": "P-256",
            "x": "1vhITK3acqbn4RZJFI5AN-kr9LXjlRxJCVs4uxZ-xMw",
            "y": "-thMll_yKwxCpnhX3qXt6E-5uQyGgZBWz7esrFB4qlA"
        }

        const result = encryptionHelper.verifyCredential(
            wrongPublicKey,
            credential
        );
        expect(result).to.be.false;
    });

    it('unhappy verify credential - tampered credential', () => {
        const credential = JSON.parse(JSON.stringify(dataFactory.jsonCredential));
        const { keyPair } = dataFactory;

        credential.expirationDate = '2033-09-28T15:52:47Z';

        const result = encryptionHelper.verifyCredential(
            keyPair.keys[0],
            credential
        );
        expect(result).to.be.false;
    });
});

describe('test createHmac()', () => {
    it('happy create hmac without secret', async () => {
        const hmac = encryptionHelper.createHmac('encode me');

        expect(hmac).to.have.property('nonce');
        expect(hmac).to.have.property('hmac');
        expect(hmac).to.have.property('algorithm');

        expect(hmac.algorithm).to.equal('HS256');
    });

    it('happy create hmac with secret', async () => {
        const secret = 'eC50J7tKA7uV02PwiWamJZCptcuV6Awy9TnHLvf93dI'
        const hmacString = 'nE86mS9pnIu-cGZJmEFZTiX6YFU7HE3n8AzIA-Wzdbc';

        const decodedSecret = CryptoJS.enc.Base64.parse(secret);
        delete decodedSecret.$super;

        const hmac = encryptionHelper.createHmac(
            'encode me',
            decodedSecret
        );

        expect(hmac).to.have.property('nonce');
        expect(hmac).to.have.property('hmac');
        expect(hmac).to.have.property('algorithm');

        expect(hmac.nonce).to.equal(secret);
        expect(hmac.hmac).to.equal(hmacString);
        expect(hmac.algorithm).to.equal('HS256');
    });
});

describe('test verifyHmac()', () => {
    it('happy verify hmac', async () => {
        const secret = 'eC50J7tK+7uV02PwiWamJZCptcuV6Awy9TnHLvf93dI='
        const hmacString = 'zuOtGQ4VbjfuIVaFm302Rjh0O9bPSY1HKwiaDM69fso=';

        const result = encryptionHelper.verifyHmac(
            'encode me',
            hmacString,
            secret
        );

        expect(result).to.be.true;
    });

    it('unhappy verify hmac - wrong value', async () => {
        const secret = 'eC50J7tK+7uV02PwiWamJZCptcuV6Awy9TnHLvf93dI='
        const hmacString = 'zuOtGQ4VbjfuIVaFm302Rjh0O9bPSY1HKwiaDM69fso=';

        const result = encryptionHelper.verifyHmac(
            'wrong',
            hmacString,
            secret
        );

        expect(result).to.be.false;
    });

    it('unhappy verify hmac - wrong secret', async () => {
        const wrongSecret = '6J5KftjBU0W5Qw2q9vLjma5djiNIEX/6U3iQ1XQ38RY='
        const hmacString = 'zuOtGQ4VbjfuIVaFm302Rjh0O9bPSY1HKwiaDM69fso=';

        const result = encryptionHelper.verifyHmac(
            'encode me',
            hmacString,
            wrongSecret
        );

        expect(result).to.be.false;
    });

    it('unhappy verify hmac - wrong hmac', async () => {
        const secret = 'eC50J7tK+7uV02PwiWamJZCptcuV6Awy9TnHLvf93dI='
        const wrongHmac = 'wMQireEFrI/8VwA87s5kXeRzRsWRj2ZmfOJgXoMUd1o=';

        const result = encryptionHelper.verifyHmac(
            'encode me',
            wrongHmac,
            secret
        );

        expect(result).to.be.false;
    });
});
