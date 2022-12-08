// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const express = require('express');
const fs = require('fs');
const https = require('https');
const morgan = require('morgan');
const passport = require('passport');
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const session = require('cookie-session');
const events = require('events');

const credentialRoutes = require('./routes/credential');
const issuerRoutes = require('./routes/issuer');
const genericIssuerRoutes = require('./routes/generic-issuer');
const schemaRoutes = require('./routes/schema');
const userRoutes = require('./routes/users');
const healthRoutes = require('./routes/health');

const swaggerDoc = require('./swagger.json');
const dbHelper = require('./helpers/nosql-db-helper');
const authStrategyHelper = require('./helpers/auth-strategy-helper');
const keyStoreHelper = require('./helpers/key-store-helper');
const tlsHelper = require('./helpers/tls-helper');

const { getErrorInfo } = require('./utils');
const logger = require('./utils/logger').getLogger('app');

const port = process.env.PORT || 3010;
const contextRoot = process.env.CONTEXT_ROOT;
const useHttps = process.env.USE_HTTPS
    ? process.env.USE_HTTPS === 'true' || process.env.USE_HTTPS === 'TRUE'
    : false;
let serverCert;
let serverKey;

const emitter = new events.EventEmitter()

if (useHttps) {
    const tlsFolder = process.env.TLS_FOLDER_PATH || './config/tls';
    serverCert = path.resolve(tlsFolder, 'server.cert');
    serverKey = path.resolve(tlsFolder, 'server.key');

    logger.info(`Using server.key & server.cert from folder = ${tlsFolder}`);
    logger.info(`server cert file = ${serverCert}`);
    logger.info(`server key file = ${serverKey}`);
}

const app = express();

process.on('warning', (warning) => {
    logger.warn('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    logger.warn(`Warning name: ${warning.name}`);
    logger.warn(`Warning message: ${warning.message}`);
    logger.warn(`Stack trace: ${warning.stack}`);
    logger.warn('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
});

process.on('unhandledRejection', (reason, p) => {
    logger.warn('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    logger.warn(`Unhandled Rejection at promise: ${JSON.stringify(p)} reason: ${reason}`);
    logger.warn('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
});

process.on('uncaughtException', (err) => {
    logger.warn('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    logger.warn(`Uncaught exception = ${err}`);
    logger.warn(`Uncaught stack = ${err.stack}`);
    logger.warn('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
});

const setupRoutes = () => {
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(
        bodyParser.urlencoded({
            extended: false,
        })
    );
    app.use(bodyParser.json());
    app.use(passport.initialize());
    
    app.enable('trust proxy');
    // 1 day or by default expires at the end of session.
    const expiryDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            cookie: {
                secure: true,
                httpOnly: true,
                domain: 'merative.com',
                path: 'hpass/',
                expires: expiryDate,
                sameSite: 'strict',
                maxAge: 7200000,
            },
        })
    );

    app.use(`${contextRoot}/health`, healthRoutes);
    app.use(`${contextRoot}/credentials`, credentialRoutes.getRouter());
    app.use(`${contextRoot}/issuers`, issuerRoutes.getRouter());
    app.use(`${contextRoot}/generic-issuers`, genericIssuerRoutes.getRouter());
    app.use(`${contextRoot}/schemas`, schemaRoutes.getRouter());
    app.use(`${contextRoot}/users`, userRoutes);
    app.use(`${contextRoot}/api-docs`, swaggerUI.serve, swaggerUI.setup(swaggerDoc));

    app.use((req, res, next) => {
        const error = new Error('No route found');
        error.status = 404;
        next(error);
    });

    app.use((error, req, res) => {
        res.status(error.status || 500);
        res.json({
            error: {
                message: error.message,
            },
        });
    });
}

const onStartUp = () => {
    return (err) => {
        if (err) {
            logger.error(`Error starting server: ${err}`);
            // eslint-disable-next-line no-process-exit
            process.exit(1);
        }

        logger.info(`Server listing on port ${port}`);
        emitter.emit("appStarted");
    };
}

const startApp = async () => {
    try {
        dbHelper.init();
        await dbHelper.getInstance().init();
        authStrategyHelper.init();
        keyStoreHelper.init();
    } catch (err) {
        const { errorMsg } = getErrorInfo(err);
        logger.error(
            `Unable to initialize service: ${errorMsg}`
        );
        // eslint-disable-next-line no-process-exit
        process.exit(1);
    }
    
    setupRoutes();

    if (useHttps) {
        logger.info('useHttps is true');
        const foundKeyFiles = tlsHelper.validateSSLFiles(serverKey, serverCert);
        if (!foundKeyFiles) {
            logger.error('Unable to validate ssl files');
            // eslint-disable-next-line no-process-exit
            process.exit(1);            
        }
        const options = {
            key: fs.readFileSync(serverKey),
            cert: fs.readFileSync(serverCert),
            secureOptions: tlsHelper.getSecureOptions(),
            ciphers: tlsHelper.getCiphersForServerOptions(),
            honorCipherOrder: true,
        };
        https.createServer(options, app).listen(port, onStartUp());
    } else {
        logger.info('useHttps is false');
        app.listen(port, onStartUp());
    }
}

startApp();

module.exports = {
    app, emitter
};
