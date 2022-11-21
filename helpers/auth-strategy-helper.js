// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const path = require('path');

const AuthStrategy = require('../middleware/authentication/auth-strategy');
const { getErrorInfo } = require('../utils');

const logger = require('../utils/logger').getLogger(
    'auth-strategy-helper'
);

// placeholder so intellisense works
let instance = new AuthStrategy();

const init = () => {
    const fileName = process.env.AUTH_STRATEGY_FILE_NAME;
    const filePath = path.join(__dirname, '..', 'middleware', 'authentication', fileName);

    logger.info(`Loading auth strategy from ${fileName}`);

    try {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const authStrategy = require(filePath);
        // eslint-disable-next-line new-cap
        const instantiatedAuthStrategy = new authStrategy();
        instance = new AuthStrategy(instantiatedAuthStrategy);
    } catch (err) {
        const { errorMsg } = getErrorInfo(err);
        throw new Error(
            `Unable to load Auth Strategy helper file ${fileName}: ${errorMsg}`
        );
    }
}

const getInstance = () => {
    return instance;
}

module.exports = {
    init,
    getInstance,
}
