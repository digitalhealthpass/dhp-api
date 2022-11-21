// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const { validate } = require('jsonschema')
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

const issuerHelper = require("./issuer-helper");
const encryptionHelper = require('./encryption-helper');
const schemaHelper = require('./schema-helper');
const obfuscationHelper = require('./obfuscation-helper')
const constants = require('./constants');
const noSqlDbHelper = require('./nosql-db-helper');
const { getErrorInfo } = require('../utils');
const credentialFormat = require('./credentials-format');

const logger = require('../utils/logger').getLogger(
    'credential-helper'
);

const getKeyPair = async (issuerId) => {
    const keyPair = await issuerHelper.getKeyPair(issuerId);
    if (!keyPair) {
        const error = new Error(`Unknown issuer id`);
        error.status = 404;
        throw error;
    }
    return keyPair;
}

const isExpiredDate = (date) => {
    if (!date) {
        return false;
    }

    const parsedDate = new Date(date);
    
    return parsedDate <= new Date()
}

const createJsonCredential = async (
    issuerId,
    schemaID,
    type,
    data,
    expirationDate,
    obfuscation,
) => {
    if (isExpiredDate(expirationDate)) {
        const error = new Error('Credential is expired');
        error.status = 400;
        throw error;
    }

    const schema = await schemaHelper.getSchema(schemaID);
    const result = validate(data, schema.schema);

    if (!result.valid) {
        const error = new Error(
            `JSON schema validation failed: [${result.errors.join('; ')}]`
        );
        error.status = 400;
        throw error;
    }

    const keyPair = await getKeyPair(issuerId);
    const did = keyPair.creator;
    const id = `${did};vc-${uuidv4()}`;
    const publicKeyId = `${did}-key${keyPair.version}`
    type.push('VerifiableCredential');

    const unsignedCredential = {
        '@context': [
            constants.CREDENTIAL_CONTEXT
        ],
        id,
        type,
        issuer: did,
        issuanceDate: `${moment().toISOString().slice(0,-5)}Z`,
        expirationDate,
        credentialSchema: {
            id: schema.id,
            type: constants.SCHEMA_VALIDATION_VERSION
        },
        credentialSubject: data,
    };

    const signedCredential =  encryptionHelper.signCredential(
        keyPair.keys[1], publicKeyId, unsignedCredential 
    );

    if (obfuscation) {
        signedCredential.obfuscation = obfuscation;
    }
    
    const obfuscatedCredential = obfuscationHelper.obfuscateCredential(signedCredential);
    return obfuscatedCredential;
}

const isRevoked = async (credential) => {
    if (!credential.id) {
        const error = new Error('Credential is missing id');
        error.status = 400;
        throw error;
    }

    try {
        await noSqlDbHelper.getInstance().getDoc(
            constants.NOSQL_CONTAINER_ID.REVOKED_CREDENTIAL, credential.id
        );
        return true;
    } catch(err) {
        if (err.status === 404) {
            return false;
        }
        const error = new Error(`Unable to check revoked status: ${err.message}`);
        error.status = err.status;
        throw error;
    }
}

const decodeCredential = (encodedCredential) => {
    try {
        return JSON.parse(Buffer.from(encodedCredential, 'base64').toString());
    } catch(err) {
        const error = new Error(
            `Credential must be base64 encoded`
        );
        error.status = 400;
        throw error;
    }
}

// TODO: probably use issuerId in partition key 
const verifyCredential = async (encodedCredential) => {
    let credential = decodeCredential(encodedCredential);

    let status;

    try {
        credential = obfuscationHelper.verifyObfuscation(credential);
    } catch (err) {
        status = constants.CREDENTIAL_VERIFICATION_STATUS.DEOBFUSCATION_FAILED;
        logger.warn(err.message);
    }

    if (!status && isExpiredDate(credential.expirationDate)) {
        status = constants.CREDENTIAL_VERIFICATION_STATUS.EXPIRED;
    } else if (!status) {
        const [did, key] = credential.proof.creator.split('-');
        const publicJwk = await issuerHelper.getPublicKey(did, key);
        if (!publicJwk) {
            const error = new Error(`Issuer not found`);
            error.status = 404;
            throw error;
        }

        const isVerified = encryptionHelper.verifyCredential(publicJwk, credential);
    
        if (isVerified) {
            const revoked = await isRevoked(credential);
            status = revoked
                ? constants.CREDENTIAL_VERIFICATION_STATUS.REVOKED
                : constants.CREDENTIAL_VERIFICATION_STATUS.VALID;
        } else {
            status = constants.CREDENTIAL_VERIFICATION_STATUS.SIGNATURE_INVALID;
        }
    }
    
    logger.info(
        `Credential ${credential.id} verification status: ${status.status}`
    );

    const payload = {
        credential,
        verification_status: status.status,
        valid: status === constants.CREDENTIAL_VERIFICATION_STATUS.VALID,
        message: status.message,
    }

    return payload;
}

// TODO: probably use issuerId in partition key 
const revokeCredential = async (issuerId, revoke) => {
    try {
        await noSqlDbHelper.getInstance().writeDoc(
            constants.NOSQL_CONTAINER_ID.REVOKED_CREDENTIAL, revoke
        );
    } catch(err) {
        const { errorStatus, errorMsg } = getErrorInfo(err);
        const error = new Error(`Unable to revoke credential: ${errorMsg}`);
        error.status = errorStatus;
        throw error;
    }
}

// TODO: probably use issuerId in partition key 
const getRevokedCredential = async (issuerId, did) => {
    try {
        const response = await noSqlDbHelper.getInstance().getDoc(
            constants.NOSQL_CONTAINER_ID.REVOKED_CREDENTIAL, did
        );
        return noSqlDbHelper.getInstance().sanitizeDoc(response);
    } catch(err) {
        const { errorStatus } = getErrorInfo(err);
        if (errorStatus === 404) {
            const error = new Error('Revoked credential not found');
            error.status = errorStatus;
            throw error;
        }
        throw err;
    }
}

const getAllRevokedCredentials = async (limit, skip) => {
    try {
        const response = await noSqlDbHelper.getInstance().getAllRevokedCredentials(
            limit, skip
        );
        return response;
    } catch(err) {
        const { errorStatus } = getErrorInfo(err);
        if (errorStatus === 404) {
            const error = new Error('No revoked credentials found');
            error.status = errorStatus;
            throw error;
        }
        throw err;
    }
}

const custAndOrgFromCredentialSubject = (credentialSubject) => {
    let customer;
    let organization;
    if(credentialSubject) {
        if(credentialSubject.customer){
            customer = credentialSubject.customer;
        }
        if(credentialSubject.organization) {
            organization = credentialSubject.organization;
        }
    }
    return {
        customer,
        organization,
    }
}

const checkForValidationErrors = (validatorResult, customer, organization) => {
    logger.debug(`Attempting to validate credentials of ${customer}/${organization}`);

    if (!validatorResult.errors.length) {
        return;
    }
    logger.warn(`Failed to validate VC of ${customer}/${organization} with 
        ${validatorResult.errors}`);

    const error = new Error(
        'Supplied credential is not in hpass credentials format'
    );
    error.status = 400;
    throw error;
}

const validateVcExpirationDateExists = (credential, customer, organization) => {
    if (credential.expirationDate && credential.expirationDate.trim()) {
        return;
    }
    const warnMsg = "Supplied credential is missing expirationDate";
    logger.warn(`${warnMsg} for ${customer}/${organization}`);
    const error = new Error(warnMsg);
    error.status = 400;
    throw error;
}

const validateVcCredentialData = async (encodedCred) => {
    const credential = decodeCredential(encodedCred);
    const validatorResult = validate(credential, credentialFormat.HPASS_CREDENTIALS);

    const {
        customer,
        organization
    } = custAndOrgFromCredentialSubject(credential.credentialSubject);

    validateVcExpirationDateExists(credential, customer, organization);
    checkForValidationErrors(validatorResult, customer, organization);

    if (isExpiredDate(credential.expirationDate)) {
        const error = new Error(
            `Supplied credential is expired`
        );
        error.status = 401;
        throw error;
    }

    const credIssuerDID = credential.issuer;
    const credSchemaId = credential.credentialSchema.id;
    const credIdFull = credential.id;

    // Use only last part of the credentials to uniquely identify 
    const id = credIdFull.split(';')[1]

    return { credSchemaId, credIssuerDID, id };
}

const validateVcIssuerDID = async (credSchemaId, credIssuerDID, credId) => {
    let isValid = false;
    let authorizedLoginCredIssuerDID;
    let schemaNameData;

    const schemaParts = credSchemaId.split(';');

    if (schemaParts.length === 3) {
        // eslint-disable-next-line prefer-destructuring
        schemaNameData = schemaParts[1];
        logger.debug(`Cred issuerDID ${credIssuerDID} , schemaName ${schemaNameData}`);

        try {
            authorizedLoginCredIssuerDID = await issuerHelper.getIssuerDID(process.env.ISSUER_ID);
        } catch (err) {
            const { errorStatus, errorMsg } = getErrorInfo(err);
            logger.warn(`Error calling getIssuerOwn of ${credId} with ${errorStatus}: ${errorMsg}`);
            const error = new Error('Verifiable Credential processing error');
            error.status = errorStatus;
            throw error;
        }
    }

    if (authorizedLoginCredIssuerDID === credIssuerDID) {
        const schemaName = schemaNameData.replace('id=', '');
        if (schemaName === constants.AUTHORIZED_LOGIN_CREDENTIALS.VERIFIERID_SCHEMA_NAME)
            isValid = true;
        else
            logger.warn(`VC id ${credId}: schemaName ${schemaName} 
                did not match verifierIDSchemaName`);
    } else {
        logger.warn(`VC id ${credId} : credIssuerDID ${credIssuerDID} did not match 
            authorizedIssuerDID ${authorizedLoginCredIssuerDID}`);
    }

    if (!isValid) {
        const error = new Error(
            'Verifiable Credential is not authorized'
        );
        error.status = 401;
        throw error;
    }
};


module.exports = {
    createJsonCredential,
    verifyCredential,
    revokeCredential,
    getRevokedCredential,
    getAllRevokedCredentials,
    validateVcCredentialData,
    validateVcIssuerDID,
}
