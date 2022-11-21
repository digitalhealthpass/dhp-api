// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const jp = require('jsonpath');

const encryptionHelper = require('./encryption-helper');

const validateObfuscation = (obfuscation) => {
    let error;
    if (!Array.isArray(obfuscation)) {
        error = new Error('Obfuscation must be an array');

    } else if (obfuscation.length === 0) {
        error = new Error(
            'Obfuscation array is empty.  It must either be populated or omitted'
        );
    } else {
        const set = new Set(obfuscation);
        if (set.size !== obfuscation.length) {
            error = new Error('Obfuscation cannot contain duplicates');
        }
    }

    if (error) {
        error.status = 400;
        throw error;
    }
}

const createHmac = (value, path) => {
    const hmac = encryptionHelper.createHmac(value);
    return {
        hmac: hmac.hmac,
        val: value,
        alg: hmac.algorithm,
        nonce: hmac.nonce,
        path,
    }
}

const extractValueFromPath = (credential, path) => {
    const extractedValue = jp.query(credential, `$.credentialSubject.${path}`)[0] || undefined;
    if (!extractedValue) {
        const error = new Error(
            `Unable to find obfuscation path ${path} in credential`
        );
        error.status = 400;
        throw error;
    }
    return extractedValue;
}

const obfuscateCredential = (credential) => {
    const { obfuscation } = credential
    
    if (!obfuscation) {
        return credential;
    }

    validateObfuscation(obfuscation);

    const credentialCopy = JSON.parse(JSON.stringify(credential));

    const obfuscated = [];

    obfuscation.forEach(path => {
        const extractedValue = extractValueFromPath(credentialCopy, path);
        const hmac = createHmac(extractedValue, path);

        jp.apply(credentialCopy, `$.credentialSubject.${path}`, () => hmac.hmac);
        delete hmac.hmac;
        obfuscated.push(hmac);
    });

    credentialCopy.obfuscation = obfuscated;
    return credentialCopy;
}

const verifyObfuscation = (credential) => {
    const { obfuscation } = credential;
    if (!obfuscation) {
        return credential;
    }
    validateObfuscation(obfuscation);
    
    const credentialCopy = JSON.parse(JSON.stringify(credential));

    obfuscation.forEach(o => {
        const hmac = extractValueFromPath(credentialCopy, o.path);
        
        const isVerified = encryptionHelper.verifyHmac(o.val, hmac, o.nonce);

        if (!isVerified) {
            throw new Error(
                `Unable to deobfuscate value from path ${o.path}`
            );
        }

        jp.apply(credentialCopy, `$.credentialSubject.${o.path}`, () => o.val);
    })

    delete credentialCopy.obfuscation;
    return credentialCopy;
}

module.exports = {
    obfuscateCredential,
    verifyObfuscation,
}
