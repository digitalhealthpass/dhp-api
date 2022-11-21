// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

/* eslint-disable node/no-unpublished-require */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const validator = require('../../helpers/validator-helper');
const constants = require('../../helpers/constants');

const { expect } = chai;
const { assert } = chai;
chai.use(chaiAsPromised);

describe('test validateJsonValueExists()', () => {
    it('happy validateJsonValueExists', () => {
        validator.validateJsonValueExists('name', 'value');
    });

    it('unhappy validateJsonValueExists', () => {
        try {
            validator.validateJsonValueExists('name');
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(
                'Missing name from JSON body'
            );
            expect(err.status).to.equal(400);
        }
    });
});

describe('test validateQueryParmaExists()', () => {
    it('happy validateQueryParmaExists', () => {
        validator.validateQueryParmaExists('name', 'value');
    });

    it('unhappy validateQueryParmaExists', () => {
        try {
            validator.validateQueryParmaExists('name');
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal('Missing query param name');
            expect(err.status).to.equal(400);
        }
    });
});

describe('test validateRequestHeaderExists()', () => {
    it('happy validateRequestHeaderExists', () => {
        validator.validateRequestHeaderExists('name', 'value');
    });

    it('unhappy validateRequestHeaderExists', () => {
        try {
            validator.validateRequestHeaderExists('name');
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(
                'Missing request header name'
            );
            expect(err.status).to.equal(400);
        }
    });
});

describe('test validateIssuerIdFormat()', () => {
    it('happy validateIssuerIdFormat', () => {
        validator.validateIssuerIdFormat('orgId.userId');
    });

    it('unhappy validateIssuerIdFormat', () => {
        try {
            validator.validateIssuerIdFormat('orgId');
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(
                `Issuer id header value must follow the format "orgId.userId"`
            );
            expect(err.status).to.equal(400);
        }
    });
});

describe('test validateRequestBodyExists()', () => {
    it('happy validateRequestBodyExists', () => {
        validator.validateRequestBodyExists('body');
    });

    it('unhappy validateRequestBodyExists', () => {
        try {
            validator.validateRequestBodyExists();
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(
                'Request body required'
            );
            expect(err.status).to.equal(400);
        }
    });
});

describe('test validateIsArray()', () => {
    it('happy validateIsArray', () => {
        validator.validateIsArray('name', ['value']);
    });

    it('unhappy validateIsArray', () => {
        try {
            validator.validateIsArray('name', 'value');
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(
                'name must be an array'
            );
            expect(err.status).to.equal(400);
        }
    });
});

describe('test validateKeyTypeAndUrl()', () => {
    const didWebType = constants.KEY_TYPES.DID_WEB;
    const didDHPType = constants.KEY_TYPES.DID_DHP;

    it('happy validateKeyTypeAndUrl, DID DHP with url', () => {
        validator.validateKeyTypeAndUrl(didDHPType, 'url');
    });

    it('happy validateKeyTypeAndUrl, DID DHP without url', () => {
        validator.validateKeyTypeAndUrl(didDHPType);
    });

    it('happy validateKeyTypeAndUrl, DID web with url', () => {
        validator.validateKeyTypeAndUrl(didWebType, 'url');
    });

    it('unhappy validateKeyTypeAndUrl, DID web without url', () => {
        try {
            validator.validateKeyTypeAndUrl(didWebType);
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(
                'A url value is required for DID type did:web'
            );
            expect(err.status).to.equal(400);
        }
    });

    it('unhappy validateKeyTypeAndUrl, unknown type', () => {
        try {
            validator.validateKeyTypeAndUrl('unknown');
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(
                'DID type must be either did:web or did:dhp'
            );
            expect(err.status).to.equal(400);
        }
    });
});

describe('test validateIsNumeric()', () => {
    it('happy validateIsNumeric', () => {
        validator.validateIsNumeric('name', 1);
    });

    it('unhappy validateIsNumeric', () => {
        try {
            validator.validateIsNumeric('name', 'a');
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(
                'name must be a number'
            );
            expect(err.status).to.equal(400);
        }
    });
});

describe('test validateCredentialValue()', () => {
    it('happy validateCredentialValue', () => {
        validator.validateCredentialValue('name', 'value');
    });

    it('unhappy validateCredentialValue', () => {
        try {
            validator.validateCredentialValue('name');
            assert.isOk(false, 'Exception was not thrown');
        } catch (err) {
            expect(err.message).to.equal(
                'Missing credential value name'
            );
            expect(err.status).to.equal(400);
        }
    });
});
