// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const jwt = require('jsonwebtoken');
const axios = require('axios');
const qs = require('query-string');

const { AppIDHelper } = require('dhp-auth-lib')

const options = {
    timeout: process.env.APP_ID_TIMEOUT || 10000,
    retries: process.env.APP_ID_RETRIES || 1,
    retryDelay: process.env.APP_ID_RETRY_DELAY || 3000,
}

// eslint-disable-next-line max-len
const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

const azureClientId = process.env.AZURE_CLIENT_ID;
const azureClientSecret = process.env.AZURE_CLIENT_SECRET;
const azureScope = process.env.AZURE_SCOPE;

const getAppIdHelper = () => {
    return new AppIDHelper(options);
}

const getJwtToken = (email) => {
    const token = jwt.sign(
        {
            email,
            subject: '1d44cdc1-4b78-4ef7-a5a2-08aabc13619f',
            given_name: 'Tester',
            family_name: 'POC',
            tenant: '14dbfeaa-d6bf-4c10-974c-2c45df4666df',
            name: 'Tester POC',
            organization: 'HealthPassOrg',
        },
        'secretkey$5',
        {
            expiresIn: '8h',
        }
    );

    return {
        access_token: token,
        id_token: token,
        token_type: 'Bearer',
        expires_in: 28800,
        scope: 'test',
    };
};

const validateEmailAndPassword = (email, password) => {
    if (!email || !password || !emailRegex.test(email)) {
        const error = new Error(
            'The email or password that you entered is incorrect.'
        );
        error.status = 400;
        throw error;
    }
}

const loginWithAzureCredentials = async (username, password) => {
    const azureTenantId = process.env.AZURE_TENANT_ID;
    const azureLoginUrl =
        `https://login.microsoftonline.com/${azureTenantId}/oauth2/v2.0/token`;

    const data = qs.stringify({
        client_id: azureClientId,
        username,
        password,
        client_secret: azureClientSecret,
        grant_type: 'password',
        scope: azureScope,
    })

    const response = await axios.post(
        azureLoginUrl,
        data,
        {
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                accept: 'application/json',
            },
        });

    return {
        access_token: response.data.access_token,
        expires_in: response.data.expires_in,
        token_type: response.data.token_type,
    }
}

const getDefaultIssuerId = () => {
    const issuerID = process.env.ISSUER_ID;
    if (issuerID) {
        return issuerID;
    }
    throw new Error(
        `Environment variable ISSUER_ID is not set. Please check the deployment`
    )
}

module.exports = {
    getAppIdHelper,
    getJwtToken,
    validateEmailAndPassword,
    loginWithAzureCredentials,
    getDefaultIssuerId,
};
