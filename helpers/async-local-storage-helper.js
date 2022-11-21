// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const { AsyncLocalStorage } = require('async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

const getAsyncLocalStorage = () => {
    return asyncLocalStorage;  
};

module.exports = {
    getAsyncLocalStorage,
}
