// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

/* eslint-disable no-empty-function */
/* eslint-disable class-methods-use-this */
/* eslint-disable node/no-unpublished-require */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-classes-per-file */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const keystoreHelper = require('../../helpers/key-store-helper');
const KeyStore = require('../../key-store/key-store');
const KeyProtect = require('../../key-store/key-protect');
const KeyVault = require('../../key-store/key-vault');
const NoSqlStore = require('../../key-store/nosql-store');

const { expect } = chai;
chai.use(chaiAsPromised);


describe('test keystore helper', () => {
    it('happy key protect key store', () => {
        process.env.KEY_STORE_FILE_NAME = 'key-protect.js';
        keystoreHelper.init();
        const instance = keystoreHelper.getInstance();

        expect(instance).to.be.an.instanceOf(KeyStore);
        expect(instance.instance).to.be.an.instanceOf(KeyProtect);

    });

    it('happy key protect key vault', () => {
        process.env.KEY_STORE_FILE_NAME = 'key-vault.js';
        keystoreHelper.init();
        const instance = keystoreHelper.getInstance();

        expect(instance).to.be.an.instanceOf(KeyStore);
        expect(instance.instance).to.be.an.instanceOf(KeyVault);

    });

    it('happy key protect nosql store', () => {
        process.env.KEY_STORE_FILE_NAME = 'nosql-store.js';
        keystoreHelper.init();
        const instance = keystoreHelper.getInstance();

        expect(instance).to.be.an.instanceOf(KeyStore);
        expect(instance.instance).to.be.an.instanceOf(NoSqlStore);

    });

    it('unhappy key protect nosql store', () => {
        process.env.KEY_STORE_FILE_NAME = 'unknown.js';
        
        try {
            keystoreHelper.init();
        } catch (err) {
            
            expect(err.message).to.include(
                'Unable to load keystore file unknown.js'
            );
            expect(err.status).to.equal(500);
        }
    });
});
