// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const utils = require('../utils')
const encryptionHelper = require('./encryption-helper');
const dbHelper = require('./nosql-db-helper');
const keyStoreHelper = require('./key-store-helper');
const constants = require('./constants');
const { getErrorInfo } = require('../utils');
const logger = require('../utils/logger').getLogger('issuer-controller');

const doesIssuerExist = async (did) => {
    try {
        await dbHelper.getInstance().getDoc(
            constants.NOSQL_CONTAINER_ID.ISSUER,
            did
        );
        return true;
    } catch (err) {
        const { errorStatus } = getErrorInfo(err);
        if (errorStatus === 404) {
            return false;
        }
        throw err;
    }
}

const getIssuerMetadata = async (did) => {
    try {
        return await dbHelper.getInstance().getDoc(
            constants.NOSQL_CONTAINER_ID.META_DATA,
            did
        );
    } catch (err) {
        const { errorStatus } = getErrorInfo(err);
        if (errorStatus === 404) {
            return undefined;
        }
        throw err;
    }
}
const getKeyPair = async (issuerId) => {
    const key = `${issuerId}${constants.KEY_PAIR_POSTFIX}`;
    try {
        const keyPair = await keyStoreHelper.getInstance().getSecret(
            key
        );
        return keyPair;
    } catch (err) {
        const { errorStatus } = getErrorInfo(err);
        if (errorStatus === 404) {
            return undefined;
        }
        throw err;
    }
}

const createIssuer = async (publicPem, privatePem, keyPairType, issuerId, url) => {
    let keyPair = await getKeyPair(issuerId);
    let did;
    let publicKeyId;

    // It is possiable that a previous attempt to create and issuer
    // successfully added to key vault but failed to add to cosmos.
    // This corrects that situation on subsequent attempt
    if (keyPair) {
        did = keyPair.creator;
        publicKeyId = keyPair.id;
        const exists = await doesIssuerExist(did);
        if (exists) {
            const err = new Error(`Issuer ${issuerId} already exists`);
            err.status = 409;
            throw err;
        }

    } else {
        keyPair = await encryptionHelper.keyPairFromPems(publicPem, privatePem);

        did = utils.createDid(issuerId, keyPairType, url);
        publicKeyId = `${did}-key1`;
        keyPair.creator = did;
        keyPair.id = `${issuerId}${constants.KEY_PAIR_POSTFIX}`;
        keyPair.version = 1; // version get incremented when rotating the keys
    }

    try {
        await keyStoreHelper.getInstance().saveSecret(
            `${issuerId}${constants.KEY_PAIR_POSTFIX}`,
            keyPair,
        );
    } catch (err) {
        const { errorStatus } = getErrorInfo(err);
        if (errorStatus === 409) {
            logger.warn(`Issuer ${issuerId} already exists`)
        } else {
            throw err;
        }
    }

    const publicKey = {
        id: publicKeyId,
        type: 'secp256r1',
        controller: did,
        publicKeyJwk: keyPair.keys[0],
    }

    const issuerDoc = {
        id: did,
        '@context': [
            'https://www.w3.org/ns/did/v1'
        ],

        publicKey: [
            publicKey
        ],
    }
    if (keyPairType === constants.KEY_TYPES.DID_WEB) {
        issuerDoc['@context'].push("https://w3id.org/security/suites/jws-2020/v1")
        issuerDoc.assertionMethod = [publicKeyId]
        issuerDoc.authentication = [publicKeyId]
    }

    const savedIssuerDoc = await dbHelper.getInstance().writeDoc(
        constants.NOSQL_CONTAINER_ID.ISSUER,
        issuerDoc
    );
    return dbHelper.getInstance().sanitizeDoc(savedIssuerDoc);
}

const getPublicKeys = async (limit, skip) => {
    try {
        const issuerInfo = await dbHelper.getInstance().getAllPublicKeys(
            limit, skip
        );
        return issuerInfo;
    } catch (err) {
        const { errorStatus } = getErrorInfo(err);
        if (errorStatus === 404) {
            return [];
        }
        throw err;
    }
}

const getPublicKey = async (did, key) => {
    try {
        const issuerInfo = await dbHelper.getInstance().getDoc(
            constants.NOSQL_CONTAINER_ID.ISSUER,
            did
        );
        if (key) {
            const publicKeys = issuerInfo.publicKey;
            for (let i = 0; i < publicKeys.length; i += 1) {
                if (`${did}-${key}` === publicKeys[i].id) {
                    return publicKeys[i].publicKeyJwk;
                }
            }
            return undefined;
        }
        return issuerInfo;
    } catch (err) {
        const { errorStatus } = getErrorInfo(err);
        if (errorStatus === 404) {
            return undefined;
        }
        throw err;
    }
}

const updateMetadata = async (did, metadata) => {
    // Make sure issuer DID is onboarded
    let savedIssuerDoc;
    const exists = await doesIssuerExist(did);
    if (!exists) {
        const err = new Error(`Issuer did ${did} not found`);
        err.status = 404;
        throw err;
    }
    
    try {
        const existingMetadata = await getIssuerMetadata(did);
        if (existingMetadata) {
            // TODO: merge existing and new metadata
            const metadataCopy = JSON.parse(JSON.stringify(metadata));
            metadataCopy.rev = existingMetadata.rev
            savedIssuerDoc = await dbHelper.getInstance().putDoc(
                constants.NOSQL_CONTAINER_ID.META_DATA,
                metadataCopy,
            );
        } else {
            savedIssuerDoc = await dbHelper.getInstance().writeDoc(
                constants.NOSQL_CONTAINER_ID.META_DATA,
                metadata,
            );
        }
    } catch (err) {
        const { errorMsg } = getErrorInfo(err);
        logger.warn(`Update metadata: ${errorMsg}`);
        throw err;
    }
    return dbHelper.getInstance().sanitizeDoc(savedIssuerDoc);
}

const rotateIssuerKeys = async (publicPem, privatePem, issuerId) => {
    const keyPair = await getKeyPair(issuerId);

    if (!keyPair) {
        const err = new Error(`Issuer ${issuerId} is not onboarded`);
        err.status = 404;
        throw err;
    } else {
        const newKeyPair = await encryptionHelper.keyPairFromPems(publicPem, privatePem);
        keyPair.keys = newKeyPair.keys;
        keyPair.version += 1; // version get incremented when rotating the keys  
    }

    await keyStoreHelper.getInstance().updateSecret(
        `${issuerId}${constants.KEY_PAIR_POSTFIX}`,
        keyPair,
    );

    const issuerDoc = await dbHelper.getInstance().getDoc(
        constants.NOSQL_CONTAINER_ID.ISSUER,
        keyPair.creator
    );

    const publicKeyId = `${keyPair.creator}-key${keyPair.version}`
    const newPublicKey = {
        id: publicKeyId,
        type: 'secp256r1',
        controller: keyPair.creator,
        publicKeyJwk: keyPair.keys[0],
    }
    if (keyPair.creator.startsWith(constants.KEY_TYPES.DID_WEB)) {
        issuerDoc.assertionMethod.push(publicKeyId)
        issuerDoc.authentication.push(publicKeyId)
    }

    issuerDoc.publicKey.push(newPublicKey);

    const savedIssuerDoc = await dbHelper.getInstance().putDoc(
        constants.NOSQL_CONTAINER_ID.ISSUER,
        issuerDoc
    );
    return dbHelper.getInstance().sanitizeDoc(savedIssuerDoc);
}

const getIssuerDID = async (issuerId) => {
    const id = `${issuerId}${constants.KEY_PAIR_POSTFIX}`;

    try {
        const keyPair = await keyStoreHelper.getInstance().getSecret(id);
        return keyPair.creator;
    } catch (err) {
        const { errorStatus, errorMsg } = getErrorInfo(err);
        const error = new Error(
            `Unable to get issuer did for ${issuerId}: ${errorMsg}`
        )
        error.status = errorStatus;
        throw error;
    }
}

module.exports = {
    createIssuer,
    getKeyPair,
    getPublicKeys,
    getPublicKey,
    updateMetadata,
    getIssuerMetadata,
    rotateIssuerKeys,
    getIssuerDID,
}
