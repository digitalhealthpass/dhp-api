// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const { constants } = require('crypto');
const fs = require('fs');
const https = require('https');

const logger = require('../utils/logger').getLogger('tls-helper');

const agentTrustSelfSigned = new https.Agent({
    rejectUnauthorized: false,
});

const validateSSLFiles = (serverKey, serverCert) => {
    let foundKeyFiles = true;
    if (!fs.existsSync(serverKey)) {
        const errorString = `ERROR opening key file ${serverKey} for TLS, cannot start server`;
        logger.error(errorString);
        foundKeyFiles = false;
    }
    if (!fs.existsSync(serverCert)) {
        const errorString = `ERROR opening cert file ${serverCert} for TLS, cannot start server`;
        logger.error(errorString);
        foundKeyFiles = false;
    }
    return foundKeyFiles;
};

const getCapCiphers = () => {
    // reference: https://www.openssl.org/docs/man1.1.1/man1/ciphers.html#CIPHER-LIST-FORMAT
    return [
        'ECDHE-RSA-AES128-GCM-SHA256', // TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
        'ECDHE-RSA-AES256-GCM-SHA384', // TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
        'ECDHE-RSA-AES128-SHA256', // TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256
        'ECDHE-RSA-AES256-SHA384', // TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384
        'AES256-GCM-SHA384', // TLS_RSA_WITH_AES_256_GCM_SHA384
        'AES256-SHA256', // TLS_RSA_WITH_AES_256_CBC_SHA256
        'AES128-GCM-SHA256', // TLS_RSA_WITH_AES_128_GCM_SHA256
        'AES128-SHA256', // TLS_RSA_WITH_AES_128_CBC_SHA256
        // default value:
        // 'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA',
        // 'TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA',
        // 'TLS_RSA_WITH_AES_256_CBC_SHA',
        // 'TLS_RSA_WITH_AES_128_CBC_SHA'
    ];
};

const getCiphersForServerOptions = () => {
    // eslint-disable-next-line prefer-template
    return getCapCiphers().join(':') + ':!MD5:!aNULL';
};

const getSecureOptions = () => {
    return (
        // eslint-disable-next-line max-len, no-bitwise
        constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1
    );
};

const getAgentHeaderForSelfSignedCerts = () => {
    return agentTrustSelfSigned;
};

module.exports = {
    validateSSLFiles,
    getCapCiphers,
    getCiphersForServerOptions,
    getSecureOptions,
    getAgentHeaderForSelfSignedCerts,
};
