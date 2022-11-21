// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

class KeyStore {
    constructor(instance) {
        if (instance) {
            if (!(instance instanceof KeyStore)) {
                throw new Error(`Instance parameter must inherent from KeyStore`);
            }

            this.instance = instance;
        }
    }

    async saveSecret(key, value) {
        this.verifyInstance('saveSecret');
        return this.instance.saveSecret(key, value);
    };

    async updateSecret(key, value) {
        this.verifyInstance('updateSecret');
        return this.instance.updateSecret(key, value);
    };

    async getSecret(key) {
        this.verifyInstance('getSecret');
        return this.instance.getSecret(key);
    };

    verifyInstance(methodName) {
        if (!this.instance) {
            throw new Error(
                `A KeyStore instance must be passed to the constructor to invoke methods`
            );
        }
        if(typeof this.instance[methodName] !== 'function') {
            throw new Error(`${methodName}() method must be implemented`);
        }
    }
}

module.exports = KeyStore;
