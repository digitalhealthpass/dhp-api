// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const express = require('express');

const requestLogger = require('../middleware/request-logger');
const schemaController = require('../controllers/schema');
const authStrategyHelper = require('../helpers/auth-strategy-helper');
const constants = require('../helpers/constants');

const getRouter = () => {
    const router = express.Router();
    router.use(requestLogger);
    
    const authStrategy = authStrategyHelper.getInstance();

    const userRoleChecker = authStrategy.getAuthStrategy();
    const schemaWriterRoleChecker
        = authStrategy.getAuthStrategy(constants.ROLES.SCHEMA_WRITER);
    
    router.get(
        '/',
        ...userRoleChecker,
        schemaController.getAllSchema
    );
    
    router.post(
        '/',
        ...schemaWriterRoleChecker,
        schemaController.createSchema
    );
    
    router.get(
        '/:schemaId',
        ...userRoleChecker,
        schemaController.getSchemaById
    );
    
    return router;
}

module.exports = {
    getRouter,
};
