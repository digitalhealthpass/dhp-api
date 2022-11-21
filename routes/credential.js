// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const express = require('express');

const requestLogger = require('../middleware/request-logger');
const credentialController = require('../controllers/credential');
const constants = require('../helpers/constants');
const authStrategyHelper = require('../helpers/auth-strategy-helper');

const getRouter = () => {
    const router = express.Router();
    router.use(requestLogger);

    const authStrategy = authStrategyHelper.getInstance();

    const userRoleChecker = authStrategy.getAuthStrategy();
    const credentialRevokeRoleChecker
        = authStrategy.getAuthStrategy(constants.ROLES.CREDENTIAL_REVOKE);
    const credentialVerifyRoleChecker
        = authStrategy.getAuthStrategy(constants.ROLES.CREDENTIAL_VERIFY);

    router.post(
        '/',
        ...userRoleChecker,
        credentialController.createCredential
    );

    router.post(
        '/verify',
        ...credentialVerifyRoleChecker,
        credentialController.verifyCredential,
    );

    router.get(
        '/revoked',
        ...credentialRevokeRoleChecker,
        credentialController.getAllRevokedCredentials,
    );

    router.post(
        '/revoked',
        ...credentialRevokeRoleChecker,
        credentialController.revokeCredential
    );

    router.get(
        '/revoked/:did',
        ...credentialRevokeRoleChecker,
        credentialController.getRevokedCredential
    );
    
    return router;
}

module.exports = {
    getRouter,
};
