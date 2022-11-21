// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

class AuthStrategy {
    constructor(instance) {
        if (instance) {
            if (!(instance instanceof AuthStrategy)) {
                throw new Error(`Instance parameter must inherent from AuthStrategy`);
            }

            this.instance = instance;
        }
    }

    getAuthStrategy(role) {
        this.verifyInstance('getAuthStrategy');
        return this.instance.getAuthStrategy(role);
    }

    verifyInstance(methodName) {
        if (!this.instance) {
            throw new Error(
                `An AuthStrategy instance must be passed to the constructor to invoke methods`
            );
        }
        if(typeof this.instance[methodName] !== 'function') {
            throw new Error(`${methodName}() method must be implemented`);
        }
    }
}

module.exports = AuthStrategy;
