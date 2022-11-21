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
const nock = require('nock');
const jwt = require('jsonwebtoken');
const { AppIDHelper } = require('healthpass-auth-lib')

const userHelper = require('../../helpers/user-helper');

const { assert } = chai;
const { expect } = chai;
chai.use(chaiAsPromised);

describe('test getAppIdHelper()', () => {
    it('happy get app ID helper', () => {
        const helper = userHelper.getAppIdHelper();
        expect(helper).to.be.an.instanceOf(AppIDHelper);
    });
});

describe('test getJwtToken()', () => {
    it('happy get jwt token', () => {
        const email = 'email@email.com';

        const token = userHelper.getJwtToken(email);
        
        const response = jwt.verify(token.access_token, 'secretkey$5');
        expect(response.email).to.equal(email);
    });

    it('unhappy get jwt token, wrong secret', () => {
        const email = 'email@email.com';

        const token = userHelper.getJwtToken(email);
        
        try {
            jwt.verify(token.access_token, 'wrong');
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal('invalid signature');
        }
    });
});

describe('test validateEmailAndPassword()', () => {
    it('happy validate email and password', () => {
        userHelper.validateEmailAndPassword('email@email.com', 'password');
    });

    it('unhappy validate email and password, missing email', () => {
        try {
            userHelper.validateEmailAndPassword(undefined, 'password');
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(
                'The email or password that you entered is incorrect.'
            );
            expect(err.status).to.equal(400);
        }
    });

    it('unhappy validate email and password, missing password', () => {
        try {
            userHelper.validateEmailAndPassword('email@email.com');
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(
                'The email or password that you entered is incorrect.'
            );
            expect(err.status).to.equal(400);
        }
    });

    it('unhappy validate email and password, wrong email format', () => {
        try {
            userHelper.validateEmailAndPassword('email@email', 'password');
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(
                'The email or password that you entered is incorrect.'
            );
            expect(err.status).to.equal(400);
        }
    });
});

describe('test loginWithAzureCredentials()', () => {
    it('happy login with azure credentials', async () => {
        const expectedToken = {
            access_token: 'token',
            expires_in: 9999999,
            token_type: 'Bearer',
        }

        const tenantId = '1234';
        process.env.AZURE_TENANT_ID = tenantId;
        const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0`;

        nock(url, { allowUnmocked: false })
            .post('/token')
            .reply(200, expectedToken);

        const actualToken = await userHelper
            .loginWithAzureCredentials('email@email.com', 'password');

        expect(actualToken).to.deep.equal(expectedToken);
    });
});

describe('test getDefaultIssuerId()', () => {
    it('happy get default issuer ID', () => {
        const expected = 'issuer1';
        process.env.ISSUER_ID = expected;

        const actual = userHelper.getDefaultIssuerId();
        
        expect(actual).to.equal(expected);
    });

    it('unhappy get default issuer ID, env var not set', () => {
        delete process.env.ISSUER_ID;

        try {
            userHelper.getDefaultIssuerId();
        } catch (err) {
            expect(err.message).to.equal(
                'Environment variable ISSUER_ID is not set. Please check the deployment'
            );
        }
    });
});
