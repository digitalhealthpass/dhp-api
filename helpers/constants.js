// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const REQUEST_HEADERS = {
    ISSUER_ID: 'x-hpass-issuer-id',
    TRANSACTION_ID: 'x-hpass-txn-id',
};

const KEY_PAIR_POSTFIX = '-kp';

const COSMOSE_DB_ID = 'credential-issuer';


// TODO: remove aaa_ prefix 
const NOSQL_CONTAINER_ID = {
    ISSUER: 'issuer',
    SCHEMA: 'schema',
    REVOKED_CREDENTIAL: 'revoked-credential',
    KEYS: 'keys',
    META_DATA: 'metadata'
};

const JSON_SCHEMA_URL = 'https://w3c-ccg.github.io/vc-json-schemas/schema/1.0/schema.json';
const CREDENTIAL_CONTEXT = 'https://www.w3.org/2018/credentials/v1';
const SCHEMA_VALIDATION_VERSION = 'JsonSchemaValidator2019';
const ELLIPTIC_CURVE_TYPE = 'EcdsaSecp256r1Signature2019';

const CREDENTIAL_VERIFICATION_STATUS = {
    VALID: {
        status: 'VALID',
        message: "Credential is valid",
    },
    SIGNATURE_INVALID: {
        status: 'SIGNATURE_INVALID',
        message: "Credential's signature invalid",
    },
    REVOKED: {
        status: 'REVOKED',
        message: 'Credential has been revoked',
    },
    EXPIRED: {
        status: 'EXPIRED',
        message: 'Credential has expired',
    },
    DEOBFUSCATION_FAILED: {
        status: 'DEOBFUSCATION_FAILED',
        message: 'failed to de-obfuscate credential',
    },
}

const ROLES = {
    SCHEMA_WRITER: 'schema.write',
    CREDENTIAL_VERIFY: 'verify.invoke',
    CREDENTIAL_REVOKE: 'credential.revoke',
    HEALTHPASS_ADMIN: 'healthpass.admin',
}

const KEY_TYPES = {
    DID_WEB: 'did:web',
    DID_DHP: 'did:dhp',
}

const MAX_PAGE_SIZE = 200;

const CREDENTIAL_TYPES = {
    ENCODED: 'encoded',
    STRING: 'string',
}

const OUTPUT_TYPES = {
    QRCODE: 'qrcode',
}

const AUTHORIZED_LOGIN_CREDENTIALS = {
    VERIFIERID_SCHEMA_NAME: 'verifierlogin'
}

const NOSQL_DB_FILE_NAMES = {
    CLOUDANT: 'cloudant.js',
    COSMOSE_DB: 'cosmos-db.js',
    COUCH_DB: 'couchdb.js',
}

const AUTH_STRATEGY_FILE_NAMES = {
    APP_ID: 'app-id-auth-strategy.js',
    AZURE: 'azure-auth-strategy.js',
    NONE: 'no-auth-strategy.js',
}

const KEY_STORE_FILE_NAMES = {
    KEY_PROTECT: 'key-protect.js',
    KEY_VAULT: 'key-vault.js',
    NOSQL: 'nosql-store.js',
}

module.exports = {
    REQUEST_HEADERS,
    KEY_PAIR_POSTFIX,
    COSMOSE_DB_ID,
    NOSQL_CONTAINER_ID,
    JSON_SCHEMA_URL,
    CREDENTIAL_CONTEXT,
    SCHEMA_VALIDATION_VERSION,
    ELLIPTIC_CURVE_TYPE,
    CREDENTIAL_VERIFICATION_STATUS,
    ROLES,
    KEY_TYPES,
    MAX_PAGE_SIZE,
    CREDENTIAL_TYPES,
    OUTPUT_TYPES,
    AUTHORIZED_LOGIN_CREDENTIALS,
    NOSQL_DB_FILE_NAMES,
    AUTH_STRATEGY_FILE_NAMES,
    KEY_STORE_FILE_NAMES,
}
