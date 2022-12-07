// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const userHelper = require('../helpers/user-helper');
const credentialHelper = require('../helpers/credential-helper');
const validator = require('../helpers/validator-helper');
const { getErrorInfo } = require('../utils');
const constants = require('../helpers/constants');

const logger = require('../utils/logger').getLogger(
    'user-controller'
);

const authClient = process.env.AUTH_STRATEGY_FILE_NAME === 'azure-auth-strategy.js'
    ? userHelper.getAppIdHelper()
    : undefined;

const handleFailedLogin = (error, res) => {
    const { errorStatus, errorMsg } = getErrorInfo(error);
    const logError = `Failed to login user: ${errorMsg}`;
    logger.warn(logError);
    return res.status(errorStatus).json({
        message: errorMsg,
        status: errorStatus,
    });
}

const loginAppId = async (req, res) => {
    const { email, password } = req.body;

    try {
        userHelper.validateEmailAndPassword(email, password);
        const authObject = await authClient.appIDLogin(email, password);
        req.session.isAuthenticated = true;
        logger.info("Login success");
        return res.status(200).json(authObject);
    } catch (error) {
        return handleFailedLogin(error, res);
    }
};

const loginJWT = (req, res) => {
    try {
        const { email, password } = req.body;
        userHelper.validateEmailAndPassword(email, password);
        const authObject = userHelper.getJwtToken(email);
        req.session.isAuthenticated = true;
        logger.info("Login success");
        return res.status(200).json(authObject);
    } catch (error) {
        return handleFailedLogin(error, res);
    }
}

const loginAzure = async (req, res) => {
    const { email, password } = req.body;

    try {
        userHelper.validateEmailAndPassword(email, password);
        const authObject = await userHelper.loginWithAzureCredentials(email, password);
        req.session.isAuthenticated = true;
        logger.info("Login success");
        return res.status(200).json(authObject);
    } catch (error) {
        return handleFailedLogin(error, res);
    }
}

const login = async (req, res) => {
    switch(process.env.AUTH_STRATEGY_FILE_NAME) {
        case constants.AUTH_STRATEGY_FILE_NAMES.APP_ID:
            return loginAppId(req, res);
        case constants.AUTH_STRATEGY_FILE_NAMES.AZURE:
            return loginAzure(req, res);
        default:
            return loginJWT(req, res);
    }
}

const loginWithVC = async (req, res) => {
    try {
        validator.validateRequestBodyExists(req.body);
        const { credential } = req.body;
        validator.validateJsonValueExists('credential', credential);

        const {
            credSchemaId, credIssuerDID, id
        } = await credentialHelper.validateVcCredentialData(credential); 
        
        validator.validateCredentialValue('credSchemaId', credSchemaId);
        validator.validateCredentialValue('credIssuerDID', credIssuerDID);
        validator.validateCredentialValue('id', id);

        await credentialHelper.validateVcIssuerDID(credSchemaId, credIssuerDID, id);

        await credentialHelper.verifyCredential(req.body.credential);

        const authObject = await authClient.loginAsClientCredentialGrant();

        return res.status(200).json(authObject);

    } catch(err) {
        return handleFailedLogin(err, res);
    }
}

module.exports = {
    login,
    loginWithVC,
    loginAzure,
}
