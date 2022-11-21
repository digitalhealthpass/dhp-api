// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const passport = require('passport');

const AuthStrategy = require('./auth-strategy');
const constants = require('../../helpers/constants');

const authenticate = passport.authenticate("oauth-bearer", { session: false });

const checkRole = (role) => (req, res, next) => {
    let hasRole = false;

    if (req.authInfo) {
        const userRole = req.roles || req.authInfo.roles;

        if (userRole) {
            if (userRole.includes(constants.ROLES.HEALTHPASS_ADMIN)) {
                next();
                return;
            }

            hasRole = userRole.includes(role);
        }
    }

    if (!hasRole) {
        res.status(401);
        return res.send('Unauthorized');
    }
    next();
}

const userAuthStrategy = () => {
    return [
        authenticate,
    ];
};

const schemaReaderAuthStrategy = (role) => {
    return [
        authenticate,
        checkRole(role)
    ];
};

const schemaWriterAuthStrategy = (role) => {
    return [
        authenticate,
        checkRole(role)
    ];
};

const credentialRevokeAuthStrategy = (role) => {
    return [
        authenticate,
        checkRole(role)];
};

const credentialVerifyAuthStrategy = (role) => {
    return [
        authenticate,
        checkRole(role)];
};

const adminAuthStrategy = (role) => {
    return [
        authenticate,
        checkRole(role)
    ];
};

class AzureAuthStrategy extends AuthStrategy {
    // eslint-disable-next-line class-methods-use-this
    getAuthStrategy(role) {
        if (process.env.AUTH_STRATEGY
            && process.env.AUTH_STRATEGY.toUpperCase() === 'DEVELOPMENT'
        ) {
            return [];
        }
        switch (role) {
            case constants.ROLES.SCHEMA_READER:
                return schemaReaderAuthStrategy(role);
            case constants.ROLES.SCHEMA_WRITER:
                return schemaWriterAuthStrategy(role);
            case constants.ROLES.CREDENTIAL_VERIFY:
                return credentialVerifyAuthStrategy(role);
            case constants.ROLES.CREDENTIAL_REVOKE:
                return credentialRevokeAuthStrategy(role);
            case constants.ROLES.HEALTHPASS_ADMIN:
                return adminAuthStrategy(role);
            default:
                return userAuthStrategy();
        }
    }    
}

module.exports = AzureAuthStrategy;
