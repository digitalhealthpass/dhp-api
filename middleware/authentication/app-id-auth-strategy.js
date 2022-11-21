// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const passport = require('passport');
const appID = require('ibmcloud-appid');

const constants = require('../../helpers/constants');
const AuthStrategy = require('./auth-strategy');

const { APIStrategy } = appID;
const appIDUrl = process.env.APP_ID_URL;

passport.use(
    new APIStrategy({
        oauthServerUrl: appIDUrl,
    })
);

const authenticateStandardUser = passport.authenticate(APIStrategy.STRATEGY_NAME, {
    session: false,
});

const authenticateSchemaReader = passport.authenticate(APIStrategy.STRATEGY_NAME, {
    session: false,
    scope: constants.ROLES.SCHEMA_READER,
});

const authenticateSchemaWriter = passport.authenticate(APIStrategy.STRATEGY_NAME, {
    session: false,
    scope: constants.ROLES.SCHEMA_WRITER,
});

const authenticateCredentialVerifier = passport.authenticate(APIStrategy.STRATEGY_NAME, {
    session: false,
    scope: constants.ROLES.CREDENTIAL_VERIFY,
});

const authenticateCredentialRevoker = passport.authenticate(APIStrategy.STRATEGY_NAME, {
    session: false,
    scope: constants.ROLES.CREDENTIAL_REVOKE,
});

const authenticateHealthpassAdmin = passport.authenticate(APIStrategy.STRATEGY_NAME, {
    session: false,
    scope: constants.ROLES.HEALTHPASS_ADMIN,
});

class AppIdAuthStrategy extends AuthStrategy {
    // eslint-disable-next-line class-methods-use-this
    getAuthStrategy(role) {
        if (process.env.AUTH_STRATEGY
            && process.env.AUTH_STRATEGY.toUpperCase() === 'DEVELOPMENT'
        ) {
            return [];
        }
        switch (role) {
            case constants.ROLES.SCHEMA_READER:
                return [authenticateSchemaReader];
            case constants.ROLES.SCHEMA_WRITER:
                return [authenticateSchemaWriter];
            case constants.ROLES.CREDENTIAL_VERIFY:
                return [authenticateCredentialVerifier];
            case constants.ROLES.CREDENTIAL_REVOKE:
                return [authenticateCredentialRevoker];
            case constants.ROLES.HEALTHPASS_ADMIN:
                return [authenticateHealthpassAdmin];
            default:
                return [authenticateStandardUser];
        }
    }    
}

module.exports = AppIdAuthStrategy;
