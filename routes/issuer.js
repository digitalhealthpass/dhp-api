// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const express = require('express');
const requestLogger = require('../middleware/request-logger');

const issuerController = require('../controllers/issuer');
const authStrategyHelper = require('../helpers/auth-strategy-helper');
const constants = require('../helpers/constants');

const getRouter = () => {
    const router = express.Router();
    router.use(requestLogger);
    
    const authStrategy = authStrategyHelper.getInstance();

    const userRoleChecker = authStrategy.getAuthStrategy();
    const adminRoleChecker
        = authStrategy.getAuthStrategy(constants.ROLES.HEALTHPASS_ADMIN);
    
    router.get(
        '/',
        ...userRoleChecker,
        issuerController.getAllIssuers
    );
    
    router.post(
        '/',
        ...adminRoleChecker,
        issuerController.createIssuer
    );
    
    router.get(
        '/:did',
        ...userRoleChecker,
        issuerController.getIssuerById
    );
    
    router.get(
        '/:did/metadata',
        ...userRoleChecker,
        issuerController.getIssuerMetadata
    );
    
    router.put(
        '/:did/metadata',
        ...adminRoleChecker,
        issuerController.updateIssuerMetadata
    );
    
    router.post(
        '/public-keys',
        ...adminRoleChecker,
        issuerController.rotateIssuerPublicKeys
    );
    
    return router;
}

module.exports = {
    getRouter,
};
