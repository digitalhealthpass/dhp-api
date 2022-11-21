// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const axios = require('axios');
const qs = require('query-string');
const https = require('https');
// eslint-disable-next-line camelcase
const jwt_decode = require('jwt-decode');

const logger = require('../utils/logger').getLogger('ibm-cloud-iam-helper');
const { getErrorInfo } = require('../utils');

let token;
let expiration;

const isExpired = () => {
    const currentTS = (new Date()).getTime() / 1000;
    return expiration - 60 < currentTS;
}

const saveTokenExpiration = () => {
    const decoded = jwt_decode(token);
    const { exp } = decoded;
    expiration = exp;
}

const getNewToken = async (serviceApiKey) => {
    const iamUrl = 'https://iam.cloud.ibm.com/identity/token';
    const apikey = serviceApiKey || process.env.APP_ID_IAM_KEY;

    const agent = new https.Agent({
        rejectUnauthorized: false,
    });

    const reqBody = qs.stringify({
        grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
        apikey,
    });
    
    const response = await axios.post(
        iamUrl,
        reqBody,
        {
            httpsAgent: agent,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                accept: 'application/json',
            }
        }
    );

    return response.data.access_token;
}

const getCloudIAMToken = async (serviceApiKey) => {
    logger.info('Getting a cloud IAM token');

    if (token && !isExpired()) {
        return token;
    }

    try {
        token = await getNewToken(serviceApiKey);
        saveTokenExpiration();
        return token;
    } catch (err) {
        const { errorStatus, errorMsg } = getErrorInfo(err);
        const error = new Error(
            `Failed to get Cloud IAM token: ${errorMsg}`
        );
        error.status = errorStatus;
        throw error;
    }
}

module.exports = {
    getCloudIAMToken
};
