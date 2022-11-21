// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const constants = require('./constants');

const didWebType = constants.KEY_TYPES.DID_WEB;
const didDHPType = constants.KEY_TYPES.DID_DHP;

const validate = (value, message) => {
    if (!value
        || (typeof value === 'object' && Object.keys(value).length === 0)
    ) {
        const error = new Error(message);
        error.status = 400;
        throw error;
    }
};

const validateJsonValueExists = (valueName, value) => {
    const msg = `Missing ${valueName} from JSON body`
    validate(value, msg);
}

const validateQueryParmaExists = (paramName, value) => {
    const msg = `Missing query param ${paramName}`
    validate(value, msg);
}

const validateRequestHeaderExists = (headerName, value) => {
    const msg = `Missing request header ${headerName}`
    validate(value, msg);
}

const validateIssuerIdFormat = (issuerId) => {
    if (issuerId.split('.').length === 2) {
        return;
    }
    const error = new Error(
        `Issuer id header value must follow the format "orgId.userId"`
    );
    error.status = 400;
    throw error;
}

const validateRequestBodyExists = (body) => {
    validate(body, 'Request body required');
}

const validateIsArray = (arrayName, array) => {
    if (Array.isArray(array)) {
        return;
    }

    const error = new Error(
        `${arrayName} must be an array`
    );
    error.status = 400;
    throw error;
}

const validateKeyTypeAndUrl = (type, url) => {
    if (type !== didWebType && type !== didDHPType) {
        const error = new Error(
            `DID type must be either ${didWebType} or ${didDHPType}`
        );
        error.status = 400;
        throw error;
    }
    if (type === didWebType && !url) {
        const error = new Error(
            `A url value is required for DID type ${didWebType}`
        );
        error.status = 400;
        throw error;
    }
}

const validateIsNumeric = (name, value) => {
    if (typeof value === 'string' || Number.isNaN(value)) {
        const error = new Error(
            `${name} must be a number`
        );
        error.status = 400;
        throw error;
    }
}

const validateCredentialValue = (name, value) => {
    const msg = `Missing credential value ${name}`
    validate(value, msg);
}

module.exports = {
    validateJsonValueExists,
    validateQueryParmaExists,
    validateRequestHeaderExists,
    validateIssuerIdFormat,
    validateRequestBodyExists,
    validateIsArray,
    validateKeyTypeAndUrl,
    validateIsNumeric,
    validateCredentialValue,
};
