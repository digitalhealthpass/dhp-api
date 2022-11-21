// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const log4js = require('log4js');

const { getAsyncLocalStorage } = require(
    '../helpers/async-local-storage-helper'
);

const logLeven = process.env.LOG_LEVEL || 'info';

log4js.addLayout('json', () => (logEvent) => {
    const log = {
        timestamp: logEvent.startTime,
        level: logEvent.level.levelStr,
        name: logEvent.categoryName,
        message: logEvent.data[0],
    };

    const store = getAsyncLocalStorage().getStore();

    if (store) {
        log.txID = store.get('txID');
    }

    return JSON.stringify(log);
});

log4js.configure(
    {
        appenders: {
            out: { type: 'console', layout: { type: 'json' } },
        },
        categories: {
            default: { appenders: ['out'], level: 'debug' },
        },
    },
);
function getLogger(module) {
    const logger = log4js.getLogger(module);
    logger.level = logLeven;
    return logger;
}

module.exports = {
    getLogger,
};
