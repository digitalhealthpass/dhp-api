// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const helper = require('../helpers/issuer-helper');
const encryptionHelper = require('../helpers/encryption-helper');
const validator = require('../helpers/validator-helper');
const constants = require('../helpers/constants');
const {
    getErrorInfo,
    logErrorByHttpStatus
} = require('../utils');

const logger = require('../utils/logger').getLogger('issuer-controller');

const createIssuer = async (req, res) => {
    try {
        validator.validateRequestBodyExists(req.body);

        let publicPem = req.body.public_key_cert;
        let privatePem = req.body.private_key_cert;

        if(!privatePem || !publicPem){
            const keyPair = encryptionHelper.generateKeyPair();
            publicPem = keyPair.publicPem
            privatePem = keyPair.privatePem
        }
        
        const { type, url, issuerId } = req.body;

        validator.validateJsonValueExists('public_key_cert', publicPem);
        validator.validateJsonValueExists('private_key_cert', privatePem);
        validator.validateJsonValueExists('type', type);
        validator.validateJsonValueExists('issuerId', issuerId);
        validator.validateKeyTypeAndUrl(type, url);    
        
        const issuerDoc = await helper.createIssuer(publicPem, privatePem, type, issuerId, url);
        return res.status(201).json({
            status: 201,
            payload: issuerDoc,
        });
    } catch(err) {
        const { errorStatus, errorMsg } = getErrorInfo(err);
        logErrorByHttpStatus(
            errorStatus,
            `Failed to create issuer: ${errorMsg}`,
            logger
        );
        return res.status(errorStatus).json({
            message: errorMsg,
            status: errorStatus
        });
    }
}

const getAllIssuers = async (req, res) => {
    logger.info('Start getAllIssuers');
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

        const payload = await helper.getPublicKeys(constrainedLimit, skip || 0);
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

const getIssuerById = async (req, res) => {
    try {
        const { did } = req.params;     
        
        const issuerDoc = await helper.getPublicKey(did);
        if (!issuerDoc) {
            const error = new Error('Issuer not found');
            error.status = 404;
            throw error;
        }
        return res.status(200).json({
            payload: issuerDoc,
        });
    } catch(err) {
        const { errorStatus, errorMsg } = getErrorInfo(err);
        logErrorByHttpStatus(
            errorStatus,
            `Failed to get issuer: ${errorMsg}`,
            logger
        );
        return res.status(errorStatus).json({
            message: errorMsg,
            status: errorStatus
        });
    }

}

const getIssuerMetadata = async (req, res) => {
    try {
        const { did } = req.params;     
        
        const issuerMetadataDoc = await helper.getIssuerMetadata(did);
        if (!issuerMetadataDoc) {
            const error = new Error(
                `Issuer did ${did} not found`
            );
            error.status = 404;
            throw error;
        }
        return res.status(200).json({
            payload: issuerMetadataDoc,
        });
    } catch(err) {
        const { errorStatus, errorMsg } = getErrorInfo(err);
        logErrorByHttpStatus(
            errorStatus,
            `Failed to get issuer metadata: ${errorMsg}`,
            logger
        );
        return res.status(errorStatus).json({
            message: errorMsg,
            status: errorStatus
        });
    }

}

const updateIssuerMetadata = async (req, res) => {
    try {
        validator.validateRequestBodyExists(req.body);

        const { did } = req.params;   
        req.body.id = did
        const issuerDoc = await helper.updateMetadata(did, req.body);
        return res.status(201).json({
            payload: issuerDoc,
        });
    } catch(err) {
        const { errorStatus, errorMsg } = getErrorInfo(err);
        logErrorByHttpStatus(
            errorStatus,
            `Failed to create issuer: ${errorMsg}`,
            logger
        );
        return res.status(errorStatus).json({
            message: errorMsg,
            status: errorStatus
        });
    }

}

const rotateIssuerPublicKeys = async(req, res) => {
    try {
        validator.validateRequestBodyExists(req.body);

        let publicPem = req.body.public_key_cert;
        let privatePem = req.body.private_key_cert;

        if(!privatePem || !publicPem){
            const keyPair = encryptionHelper.generateKeyPair();
            publicPem = keyPair.publicPem
            privatePem = keyPair.privatePem
        }
        const { issuerId } = req.body;

        validator.validateJsonValueExists('public_key_cert', publicPem);
        validator.validateJsonValueExists('private_key_cert', privatePem);
        validator.validateJsonValueExists('issuerId', issuerId);  
        
        const issuerDoc = await helper.rotateIssuerKeys(publicPem, privatePem, issuerId);
        return res.status(201).json({
            status: 201,
            payload: issuerDoc,
        });
    } catch(err) {
        const { errorStatus, errorMsg } = getErrorInfo(err);
        logErrorByHttpStatus(
            errorStatus,
            `Failed to create issuer: ${errorMsg}`,
            logger
        );
        return res.status(errorStatus).json({
            message: errorMsg,
            status: errorStatus
        });
    }
}

module.exports = {
    getAllIssuers,
    createIssuer,
    getIssuerById,
    getIssuerMetadata,
    updateIssuerMetadata,
    rotateIssuerPublicKeys,
};
