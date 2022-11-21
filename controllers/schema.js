// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const validator = require('../helpers/validator-helper');
const constants = require('../helpers/constants');
const helper = require('../helpers/schema-helper');
const {
    getErrorInfo,
    logErrorByHttpStatus
} = require('../utils');

const logger = require('../utils/logger').getLogger(
    'cosmos-db'
);

const getAllSchema = async (req, res) => {
    logger.info('Start getAllSchema');
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
        
        const payload = await helper.getAllSchemas(constrainedLimit, skip || 0);

        return res.status(200).json({
            status: 200,
            total_rows: payload.total_rows,
            limit: payload.limit,
            skip: payload.skip,
            payload: payload.payload,
        });
    } catch (error) {
        const { errorStatus, errorMsg } = getErrorInfo(error);
        logErrorByHttpStatus(
            errorStatus,
            `Failed to get schemas: ${errorMsg}`,
            logger
        );
        return res.status(errorStatus).json({
            message: errorMsg,
            status: errorStatus
        });
    }

}

const createSchema = async (req, res) => {
    logger.info('Start createSchema');
    try {
        validator.validateRequestBodyExists(req.body);
        const schema = req.body;

        const issuerId = req.headers[constants.REQUEST_HEADERS.ISSUER_ID];
        validator.validateRequestHeaderExists(
            constants.REQUEST_HEADERS.ISSUER_ID,
            issuerId,
        );
        validator.validateIssuerIdFormat(issuerId);

        validator.validateJsonValueExists('id', schema.id);
        validator.validateJsonValueExists('name', schema.name);
        validator.validateJsonValueExists('schema', schema.schema);
        validator.validateJsonValueExists('version', schema.version);

        const savedSchema = await helper.createSchema(issuerId, schema);

        return res.status(201).json({
            payload: savedSchema,
            status: 201,
        });

    } catch(error) {
        const { errorStatus, errorMsg } = getErrorInfo(error);
        logErrorByHttpStatus(
            errorStatus,
            `Failed to create schema: ${errorMsg}`,
            logger
        );
        return res.status(errorStatus).json({
            message: errorMsg,
            status: errorStatus
        });
    }
}

const getSchemaById = async (req, res) => {
    logger.info('Start getSchemaById');
    const { schemaId } = req.params;
    try {
        const schema = await helper.getSchema(schemaId);
        return res.status(200).json({
            payload: schema,
            status: 200,
        });
    } catch (error) {
        const { errorStatus, errorMsg } = getErrorInfo(error);
        logErrorByHttpStatus(
            errorStatus,
            `Failed to get schema by id ${schemaId}: ${errorMsg}`,
            logger
        );
        return res.status(errorStatus).json({
            message: errorMsg,
            status: errorStatus
        });
    }
}

module.exports = {
    getAllSchema,
    createSchema,
    getSchemaById,
};
