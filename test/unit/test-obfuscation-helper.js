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

const dataFactory = require('../data-factory');
const obfuscationHelper = require('../../helpers/obfuscation-helper');

const { expect } = chai;
const { assert } = chai;
chai.use(chaiAsPromised);

describe('test obfuscateCredential()', () => {
    it('happy obfuscate credential', () => {
        const credential = {
            credentialSubject: {
                recipient: {
                    givenName: 'Jane',
                    familyName: 'Smith',
                }
            },
            obfuscation: [
                'recipient.givenName',
                'recipient.familyName',
            ]
        }
        const obfuscated = obfuscationHelper
            .obfuscateCredential(credential);

        expect(obfuscated.credentialSubject).to.not.be.undefined;
        expect(obfuscated.credentialSubject.recipient.givenName)
            .to.not.equal('Jane');
        expect(obfuscated.credentialSubject.recipient.familyName)
            .to.not.equal('Smith');

        expect(obfuscated.obfuscation).to.not.be.undefined;
        expect(obfuscated.obfuscation.length).to.equal(2);

        expect(obfuscated.obfuscation[0].val).to.equal('Jane');
        expect(obfuscated.obfuscation[0].alg).to.equal('HS256');
        expect(obfuscated.obfuscation[0].nonce).to.not.be.undefined;
        expect(obfuscated.obfuscation[0].path).to.equal('recipient.givenName');

        expect(obfuscated.obfuscation[1].val).to.equal('Smith');
        expect(obfuscated.obfuscation[1].alg).to.equal('HS256');
        expect(obfuscated.obfuscation[1].nonce).to.not.be.undefined;
        expect(obfuscated.obfuscation[1].path).to.equal('recipient.familyName');

        obfuscationHelper.verifyObfuscation(obfuscated);
    });

    it('unhappy obfuscate credential, obfuscation not in path', () => {
        const credential = {
            credentialSubject: {
                recipient: {
                    givenName: 'Jane',
                    familyName: 'Smith',
                }
            },
            obfuscation: [
                'recipient.givenName',
                'recipient.familyName',
                'recipient.middleName',
            ]
        }

        try {
            obfuscationHelper.obfuscateCredential(credential);
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(
                'Unable to find obfuscation path recipient.middleName in credential'
            );
            expect(err.status).to.equal(400);
        }
    });
});

describe('test verifyObfuscation()', () => {
    it('happy verify obfuscation', () => {
        const credential = dataFactory.obfuscatedJsonCredential;
        const verified = obfuscationHelper.verifyObfuscation(credential);
        expect(verified.obfuscation).to.be.undefined;
        expect(verified.credentialSubject.recipient.birthDate)
            .to.equal('2000-10-10');
        expect(verified.credentialSubject.recipient.familyName)
            .to.equal('Smith');
        expect(verified.credentialSubject.recipient.givenName)
            .to.equal('Jane');
        expect(verified.credentialSubject.recipient.middleName)
            .to.equal('Sarah');
    });

    it('happy verify obfuscation, cred not obfuscated', () => {
        const credential = dataFactory.jsonCredential;
        const verified = obfuscationHelper.verifyObfuscation(credential);
        expect(verified).to.deep.equal(credential);
    });

    it('unhappy verify obfuscation, obfuscation not an array', () => {
        const credential
            = JSON.parse(JSON.stringify(dataFactory.obfuscatedJsonCredential));
        credential.obfuscation = 'abc';
        
        try {
            obfuscationHelper.verifyObfuscation(credential);
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(
                'Obfuscation must be an array'
            );
            expect(err.status).to.equal(400);
        }        
    });

    it('unhappy verify obfuscation, empty obfuscation array', () => {
        const credential
            = JSON.parse(JSON.stringify(dataFactory.obfuscatedJsonCredential));
        credential.obfuscation = [];
        
        try {
            obfuscationHelper.verifyObfuscation(credential);
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(
                'Obfuscation array is empty.  It must either be populated or omitted'
            );
            expect(err.status).to.equal(400);
        }        
    });

    it('unhappy verify obfuscation, duplicate obfuscation', () => {
        const credential
            = JSON.parse(JSON.stringify(dataFactory.obfuscatedJsonCredential));
        credential.obfuscation.push(credential.obfuscation[0]);
        
        try {
            obfuscationHelper.verifyObfuscation(credential);
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(
                'Obfuscation cannot contain duplicates'
            );
            expect(err.status).to.equal(400);
        }        
    });
});

