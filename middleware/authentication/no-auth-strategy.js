// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const AuthStrategy = require('./auth-strategy');

class NoAuthStrategy extends AuthStrategy {
    // eslint-disable-next-line class-methods-use-this
    getAuthStrategy() {
        return [];
    }
}

module.exports = NoAuthStrategy;
