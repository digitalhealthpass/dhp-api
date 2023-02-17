// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const CryptoJS = require("crypto-js");
const jose = require('node-jose');
const ECDSA = require('ecdsa-secp256r1')
const base64url = require('base64url');
const JSONNormalize = require('json-normalize');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const {jwkThumbprintByEncoding} = require ('jwk-thumbprint');

const constants = require('./constants');

// Inspired by (MIT licensed):
// https://github.com/hildjj/node-posh/blob/master/lib/index.js
function certToX5c(cert) {
    /*
     * Convert a PEM-encoded certificate to the version used in the x5c element
     * of a [JSON Web Key](http://tools.ietf.org/html/draft-ietf-jose-json-web-key).
     *             
     * `cert` PEM-encoded certificate chain
     * `maxdepth` The maximum number of certificates to use from the chain.
     */

    let x5c;

    x5c = cert.replace(/-----[^\n]+\n?/gm, ',').replace(/\n/g, '');
    x5c = x5c.split(',').filter((c) => {
        return c.length > 0;
    });

    return x5c;
}

const keyPairFromPems = async (publicPem, privatePem) => {
    try {
        const keystore = jose.JWK.createKeyStore();
        await keystore.add(publicPem, 'pem');
        await keystore.add(privatePem, 'pem');
        const keyPair = keystore.toJSON(true);

        keyPair.keys[0].x5c = certToX5c(publicPem);
        delete keyPair.keys[0].x5t;

        keyPair.keys[0]['x5t#S256'] = jwkThumbprintByEncoding(keyPair.keys[0], 'SHA-256', 'base64url');
        
        return keyPair;
    } catch (err) {
        throw new Error(
            `Unable to create key pair from provided certs: ${err.message}`
        );
    }
}

const generateKeyPair = () => {
    try {
        const keyPair = {};
        const privateKey = ECDSA.generateKey()
        keyPair.privatePem = privateKey.toPEM();
        keyPair.publicPem = privateKey.asPublic().toPEM();
        return keyPair;
    } catch (err) {
        throw new Error(
            `Unable to generate key pair: ${err.message}`
        );
    }
}

const makeProof = (creator) => {
    return {
        created: `${moment().toISOString().slice(0, -5)}Z`,
        creator,
        nonce: uuidv4(),
        type: constants.ELLIPTIC_CURVE_TYPE,
    }
}

const signCredential = (privateJwk, publicKeyId, credential) => {
    const unsignedCredential = JSON.parse(JSON.stringify(credential));
    const privateKey = ECDSA.fromJWK(privateJwk);

    unsignedCredential.proof = makeProof(publicKeyId);
    let normalizedCredential = JSONNormalize.normalizeSync(unsignedCredential);
    const signature = privateKey.sign(normalizedCredential);
    normalizedCredential = JSON.parse(normalizedCredential);

    normalizedCredential.proof.signatureValue = signature;

    return normalizedCredential;
}

const verifyCredential = (publicJwk, credential) => {
    const unsignedCredential = JSON.parse(JSON.stringify(credential));
    const signature = unsignedCredential.proof.signatureValue;
    delete unsignedCredential.proof.signatureValue;
    const publicKey = ECDSA.fromJWK(publicJwk);
    return publicKey.verify(JSONNormalize.normalizeSync(unsignedCredential), signature);
}

const createHmac = (value, secretIn) => {
    const secret = secretIn || CryptoJS.lib.WordArray.random(32);
    const hash = CryptoJS.HmacSHA256(value, secret);
    const hmac = base64url.fromBase64(CryptoJS.enc.Base64.stringify(hash));
    const nonce = base64url.fromBase64(CryptoJS.enc.Base64.stringify(secret));

    return {
        nonce,
        hmac,
        algorithm: 'HS256',
    }
}

const verifyHmac = (value, hmac, secret) => {
    const nonce = secret.replaceAll('-', '+').replaceAll('_', '/');

    const decodedSecret = CryptoJS.enc.Base64.parse(nonce);
    delete decodedSecret.$super;

    const newHmac = createHmac(value, decodedSecret);

    return base64url.fromBase64(hmac) === newHmac.hmac;
}

module.exports = {
    keyPairFromPems,
    signCredential,
    verifyCredential,
    generateKeyPair,
    createHmac,
    verifyHmac,
}
