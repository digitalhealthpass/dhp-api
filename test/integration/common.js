// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const chai = require('chai');
const chaiHTTP = require('chai-http');

const { app: server, emitter } = require('../../app');

const contextRoot = process.env.CONTEXT_ROOT;

let serverStarted = false;
let token;

const { expect } = chai;
chai.use(chaiHTTP);

// Server listen is wrapped in an async function, so chai-http does not know to wait for
// that to complete.  The app will emit an event once started and this waites for it.
const waitForServerStart = () => {
    return new Promise((resolve) => {
        if (serverStarted) {
            resolve();
            return;
        }
        emitter.on(
            "appStarted",
            () => {
                serverStarted = true;
                resolve();
            }
        )
    });
}

const getLoginConfig = () => {
    if (process.env.AUTH_STRATEGY_FILE_NAME === 'app-id-auth-strategy.js') {
        return {
            url: `${contextRoot}/users/login`,
            email: process.env.INTEGRATION_TESTS_IBM_EMAIL,
            password: process.env.INTEGRATION_TESTS_IBM_PASSWORD,
        };
    }
    if (process.env.AUTH_STRATEGY_FILE_NAME === 'azure-auth-strategy.js') {
        return {
            url: `${contextRoot}/users/login/azure`,
            email: process.env.INTEGRATION_TESTS_AZURE_EMAIL,
            password: process.env.INTEGRATION_TESTS_AZURE_PASSWORD,
        };
    }
    return undefined;
}

const login = () => {
    return new Promise((resolve) => {
        const loginConfig = getLoginConfig();
        if (!loginConfig) {
            resolve();
            return;
        }
        chai.request(server)
            .post(loginConfig.url)
            .send({
                email: loginConfig.email,
                password: loginConfig.password,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);

                token = res.body.access_token;
                resolve();
            });
    });
}

const getToken = () => {
    return token;
}

module.exports = {
    waitForServerStart,
    getLoginConfig,
    login,
    getToken,
};
