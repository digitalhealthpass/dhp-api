// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const express = require('express');
const requestLogger = require('../middleware/request-logger');

const genericIssuerController = require('../controllers/generic-issuer');
const authStrategyHelper = require('../helpers/auth-strategy-helper');

const getRouter = () => {
    const router = express.Router();
    router.use(requestLogger);

    const authStrategy = authStrategyHelper.getInstance();

    const userRoleChecker = authStrategy.getAuthStrategy();

    router.get(
        '/dcc',
        ...userRoleChecker,
        genericIssuerController.getDccIssuers
    );

    router.get(
        '/vci',
        ...userRoleChecker,
        genericIssuerController.getVciIssuers
    );

    return router;
};

module.exports = {
    getRouter,
};
