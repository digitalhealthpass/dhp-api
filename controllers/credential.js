// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const QRCode = require('qrcode');
const { PassThrough } = require('stream');

const validator = require('../helpers/validator-helper');
const helper = require('../helpers/credential-helper');
const constants = require('../helpers/constants');
const {
    getErrorInfo,
    logErrorByHttpStatus
} = require('../utils');

const logger = require('../utils/logger').getLogger(
    'credential-controller'
);

const qrCodeOptions = {
    scale: 2,
    errorCorrectionLevel: 'L',
}

const getCredentailFormat = (type) => {
    if (!type || type.toLowerCase()
        === constants.CREDENTIAL_TYPES.STRING
    ) {
        return constants.CREDENTIAL_TYPES.STRING;
    }
    if (type === constants.CREDENTIAL_TYPES.ENCODED) {
        return constants.CREDENTIAL_TYPES.ENCODED;
    }
    const error = new Error(`Unsupported output type: ${type}`);
    error.status = 400;
    throw error;
}

const getCredentialOutputType = (output) => {
    if (!output) {
        return undefined;
    }

    const qrOutput = constants.OUTPUT_TYPES.QRCODE;

    if (output.toLowerCase() === qrOutput) {
        return qrOutput;
    }

    const error = new Error(
        `Query param output must equal ${qrOutput}. Otherwise, exclude the query param`
    );
    error.status = 400;
    throw error;
}

const createCredential = async (req, res) => {
    logger.info('Start createCredential');
    try {
        const credentialFormat = getCredentailFormat(req.query.type)

        validator.validateRequestBodyExists(req.body);

        const {
            schemaID, type, data, expirationDate, obfuscation
        } = req.body;

        const issuerId = req.headers[constants.REQUEST_HEADERS.ISSUER_ID];
        validator.validateRequestHeaderExists(
            constants.REQUEST_HEADERS.ISSUER_ID,
            issuerId,
        );

        validator.validateJsonValueExists('schemaID', schemaID);
        validator.validateJsonValueExists('type', type);
        validator.validateJsonValueExists('data', data);
        validator.validateIsArray('type', type);

        const jsonCredential = await helper.createJsonCredential(
            issuerId, schemaID, type, data, expirationDate, obfuscation
        );

        const credential = credentialFormat === constants.CREDENTIAL_TYPES.STRING
            ? jsonCredential
            : Buffer.from(JSON.stringify(jsonCredential)).toString('base64');

        if (getCredentialOutputType(req.query.output)
            === constants.OUTPUT_TYPES.QRCODE
        ) {
            const passThrough = new PassThrough();
            await QRCode.toFileStream(
                passThrough,
                JSON.stringify(credential),
                qrCodeOptions,
            );
            res.status(201);
            passThrough.pipe(res);
            return undefined;
        }
        return res.status(201).json({
            message: 'Credential created successfully',
            payload: credential
        });
        
    } catch (error) {
        const { errorStatus, errorMsg } = getErrorInfo(error);
        logErrorByHttpStatus(
            errorStatus,
            `Failed to create credential: ${errorMsg}`,
            logger
        );
        return res.status(errorStatus).json({
            message: errorMsg,
            status: errorStatus
        });
    }
}

const verifyCredential = async (req, res) => {
    logger.info('Start verifyCredential');
    try {
        validator.validateRequestBodyExists(req.body);
        validator.validateJsonValueExists('credential', req.body.credential);

        const payload = await helper.verifyCredential(req.body.credential);
        return res.status(200).json({
            payload,
            status: 200,
        });
    } catch(error) {
        const { errorStatus, errorMsg } = getErrorInfo(error);
        logErrorByHttpStatus(
            errorStatus,
            `Failed to verify credential: ${errorMsg}`,
            logger
        );
        return res.status(errorStatus).json({
            message: errorMsg,
            status: errorStatus
        });
    }
}

const getAllRevokedCredentials = async (req, res) => {
    logger.info('Start getAllRevokedCredentials');
    const { limit, skip } = req.query;
    try {
        if (limit) {
            validator.validateIsNumeric('limit', parseInt(limit, 10));
        }
        if (skip) {
            validator.validateIsNumeric('skip', parseInt(skip, 10));
        }
    
        const max = constants.MAX_PAGE_SIZE;
        let constrainedLimit = limit > max ? max : limit;
        if (!constrainedLimit) {
            constrainedLimit = max;
        }

        const payload = await helper.getAllRevokedCredentials(constrainedLimit, skip || 0);
        return res.status(200).json({
            status: 200,
            total_rows: payload.total_rows,
            limit: payload.limit,
            skip: payload.skip,
            payload: payload.payload,
        });
    } catch(error) {
        const { errorStatus, errorMsg } = getErrorInfo(error);
        logErrorByHttpStatus(
            errorStatus,
            `Failed to get credentials: ${errorMsg}`,
            logger
        );
        return res.status(errorStatus).json({
            message: errorMsg,
            status: errorStatus
        });
    }
}

const revokeCredential = async (req, res) => {
    logger.info('Start revokeCredential');
    try {
        validator.validateRequestBodyExists(req.body);
        validator.validateJsonValueExists('id', req.body.id);
        validator.validateJsonValueExists('reason', req.body.reason);
    
        const issuerId = req.headers[constants.REQUEST_HEADERS.ISSUER_ID];
        validator.validateRequestHeaderExists(
            constants.REQUEST_HEADERS.ISSUER_ID,
            issuerId,
        );
        const result = await helper.revokeCredential(issuerId, req.body);
        return res.status(200).json({
            payload: result,
            status: 200,
        });
    } catch(error) {
        const { errorStatus, errorMsg } = getErrorInfo(error);
        logErrorByHttpStatus(
            errorStatus,
            `Failed to revoke credential: ${errorMsg}`,
            logger
        );
        return res.status(errorStatus).json({
            message: errorMsg,
            status: errorStatus
        });
    }
}

const getRevokedCredential = async (req, res) => {
    logger.info('Start getRevokedCredential');
    const issuerId = req.headers[constants.REQUEST_HEADERS.ISSUER_ID];
    const { did } = req.params;

    try {
        validator.validateRequestHeaderExists(
            constants.REQUEST_HEADERS.ISSUER_ID, issuerId
        );

        const response = await helper.getRevokedCredential(issuerId, did);
        return res.status(200).json({
            payload: response,
            status: 200,
        });
    } catch(error) {
        const { errorStatus, errorMsg } = getErrorInfo(error);
        logErrorByHttpStatus(
            errorStatus,
            `Failed to get revoked credential: ${errorMsg}`,
            logger
        );
        return res.status(errorStatus).json({
            message: errorMsg,
            status: errorStatus
        });
    }
}

module.exports = {
    createCredential,
    verifyCredential,
    getAllRevokedCredentials,
    revokeCredential,
    getRevokedCredential,
};
