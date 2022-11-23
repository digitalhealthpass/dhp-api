# dhp-api

**Version 2.1, November 2022**

[↳ Introduction](#introduction)

[↳ Postman](#postman)

[↳ Installation](#installation)

[↳ General Environment Variables](#general-environment-variables)

[↳ IBM Cloud Environment Variables](#ibm-cloud-environment-variables)

[↳ Azure Environment Variables](#azure-environment-variables)

[↳ Local Environment Variables](#local-environment-variables)

[↳ Testing Environment Variables](#testing-environment-variables)

[↳ Roles and Scopes](#roles-and-scopes)

[↳ Issuer Onboarding](#issuer-onboarding)

[↳ Key Rotation](#key-rotation)

[↳ Schema Creation](#schema-creation)

[↳ Credential Issuance](#credential-issuance)

[↳ Credential Verification](#credential-verification)

[↳ Credential Revocation](#credential-revocation)

[↳ Library Licenses](#library-licenses)

## Introduction

Merative<sup>®</sup> provides this service for use by [Digital Health Pass](https://www.ibm.com/products/digital-health-pass/ "Digital Health Pass") customers that want to issue and verify credentials.  This service provides the ability to onboard and maintain credential issuers, create/retrieve JSON Schema credential schemas and issue/verify/revoke verifiable credentials.  This service is designed to operate in IBM Cloud, Azure, or in a stand-alone local configuration by setting environment variables.

[↑ Top](#readme)

## Postman

A Postman collection and environment are provided in the `/postman` folder which demonstrates all the functionality of this service, including onboarding an issuer, creating schemas, and creating/verifying/revoking credentials.  To use the collection and environment you must first import them into Postman.  More information on postman can be found [here](https://www.postman.com/) and [here](https://learning.postman.com/docs/getting-started/introduction/).

[↑ Top](#readme)

## Installation

It is recommended to use [Node.js](https://nodejs.org/) v16

To install the dependencies and run the service perform the following from a command line.
Note: Environment variables must be set, as described in following sections, before starting the service. 

```
cd dhp-api
npm i
node start
```

To execute all tests run the following from a command line.

```
npm run test
```

To execute only unit tests run the following from a command line.

```
npm run test-unit
```

To execute only integration tests run the following from a command line.

```
npm run test-integration
```


## Docker Build & Run Section

### Build and Push Image 
```bash
# GH ssh key for npm dependancies 
GUTHUB_SSH_KEY=$(cat ~/.ssh/id_rsa | base64 | tr -d \\n) # a valid GH ssh key
IMAGE_TAG=foo  # Docker image tag

# Build image (passing required SSH key)
docker build --build-arg GITHUB_SSH_KEY="${GITHUB_SSH_KEY}" -t us.icr.io/dev-hpass-rns/dhp-api:${IMAGE_TAG} .
```

### Docker Registry

Example of build and pushing to IBM Cloud registry.

- Login to IBM Cloud and ICR
```bash
ibmcloud login --sso
ibmcloud cr login

echo -n "<API-KEY>" |docker login us.icr.io --username iamapikey --password-stdin

# Push image to registry
docker push us.icr.io/dev-hpass-rns/dhp-api:${IMAGE_TAG}
```

## Kubernetes Deploy and Run

- (Delete Existing and) Install Helm Release
```bash
helm delete my-namespace-dhp-api

helm upgrade --install -f ./chart/dhp-api/override.yaml my-namespace-dhp-api ./chart/dhp-api --set image.pullSecret=mypullsecret-us.icr.io --set image.repository=us.icr.io/dev-hpass-rns/dhp-api --set image.tag=<IMAGE_TAG> --namespace my-namespace
```

- Flip to a Newly Pushed Image for Existing Helm Release/Deployment
```bash
kubectl set image deployment/dhp-api dhp-api=us.icr.io/dev-hpass-rns/dhp-api:${IMAGE_TAG}
```

[↑ Top](#readme)

## General Environment Variables

The following environment variables must be set before starting the application regardless of the executing environment.

| Environment Variable | Value                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| LOG_LEVEL            | Standard log4js log levels.  debug, info, error, etc.                                          |
| CONTEXT_ROOT         | The context root for all endpoints.  e.g. /api/v1/credential-issuer                            |
| USE_HTTPS            | true or false.  If true, then endpoints must be accessed via https, otherwise http             |
| SESSION_SECRET       | A random session secret used by [cookie-session](https://www.npmjs.com/package/cookie-session) |

[↑ Top](#readme)

## IBM Cloud Environment Variables

The following environment variables must be set to execute the service in IBM Cloud

| Environment Variable    | Value                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| NOSQL_DB_FILE_NAME      | cloudant.js                                                                                         |
| AUTH_STRATEGY_FILE_NAME | app-id-auth-strategy.js                                                                             |
| KEY_STORE_FILE_NAME     | key-protect.js                                                                                      |
| CLOUDANT_URL            | The Cloudant URL found in IBM Cloud service credentials url value                                   |
| CLOUDANT_IAM_KEY        | The Cloudant IAM key found in IBM Cloud service credentials apikey value                            |
| APP_ID_URL              | The App ID URL found in IBM Cloud service credentials oauthServerUrl value                          |
| APP_ID_IAM_KEY          | The App ID URL found in IBM Cloud service credentials apikey value                                  |
| APP_ID_TENANT_ID        | The App ID URL found in IBM Cloud service credentials tenantId value                                | 
| APP_ID_AUTH_SERVER_HOST | The App ID URL found in IBM Cloud service credentials appidServiceEndpoint value                    |
| APP_ID_CLIENT_ID        | TODO: How to get this                                                                               | 
| APP_ID_SECRET           | TODO: How to get this                                                                               | 
| KEY_PROTECT_URL         | Key Protect URL found in IBM Cloud service endpoints.  The URL must be post-fixed with /api/v2/keys |
| KEY_PROTECT_GUID        | TODO: How to get this                                                                               | 
| KEY_PROTECT_IAM_KEY     | TODO: How to get this                                                                               | 


[↑ Top](#readme)

## Azure Environment Variables

The following environment variables must be set to execute the service in Azure

| Environment Variable    | Value                                                       |
| ----------------------- | ----------------------------------------------------------- |
| NOSQL_DB_FILE_NAME      | cosmos-db.js                                                |
| AUTH_STRATEGY_FILE_NAME | azure-auth-strategy.js                                      |
| KEY_STORE_FILE_NAME     | nosql-store.js                                              |
| KEY_VAULT_URL           | Key Vault URL found in the subscription's overview          |
| AZURE_TENANT_ID         | Tenant ID found in the Azure AD registered app              |
| AZURE_CLIENT_ID         | Client ID found in the Azure AD registered app              |
| AZURE_CLIENT_SECRET     | Client secret found in the Azure AD registered app          |
| AZURE_AUDIANCE          | Audiance found in the Azure AD registered app               |
| AZURE_SCOPE             | Scope found in the Azure AD registered app                  |
| COSMOS_DB_URL           | Cosmos DB URI found in the subscription's Key blade         |
| COSMOS_DB_KEY           | Cosmos DB primary key found in the subscription's Key blade |

[↑ Top](#readme)

## Local Environment Variables
The service can run locally and point to any of the configurable IBM Cloud or Azure services, but to run in a stand-alone local mode you must install [CouchDB](https://couchdb.apache.org/) locally.  The following environment variables for a stand-alone local configuration

| Environment Variable    | Value                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| COUCHDB_URL             | The local CouchDB URL including user id and password.  e.g. http://userid:password@127.0.0.1:5984 |
| NOSQL_DB_FILE_NAME      | couchdb.js                                                                                        |
| AUTH_STRATEGY_FILE_NAME | no-auth-strategy.js                                                                               |
| KEY_STORE_FILE_NAME     | nosql-store.js                                                                                    |

[↑ Top](#readme)


## Testing Environment Variables
The following environment variables must be set to run integration tests.

IBM Cloud integration tests environment variables.

| Environment Variable              | Value                                                                     |
| --------------------------------- | ------------------------------------------------------------------------- |
| INTEGRATION_TESTS_IBM_EMAIL       | The email address of an IBM App ID user with the scope `healthpass.admin` | 
| INTEGRATION_TESTS_IBM_PASSWORD    | The user's password                                                       |

Azure integration tests environment variables.

| Environment Variable              | Value                                                                         |
| --------------------------------- | ----------------------------------------------------------------------------- |
| INTEGRATION_TESTS_AZURE_EMAIL     | The email address of an Azure Cosmos DB user with the role `healthpass.admin` |
| INTEGRATION_TESTS_AZURE_PASSWORD  |   The user's password                                                         |

[↑ Top](#readme)


## Roles and Scopes

IBM Cloud requires all the scopes below to be created, assigned to roles, and then those roles be assigned to users.
Azure requires the following roles to be created within a registered app then assigned to users.

| Scopes/Roles            | Purpose                          |
| ----------------------- | -------------------------------- |
| schema.read             | Access for reading schemas       |
| schema.write            | Access for writing schemas       |
| verify.invoke           | Access for verifying credentials |
| credential.revoke       | Access for revoking credentials  |
| healthpass.admin        | Access to all endpoints          |

[↑ Top](#readme)

## Issuer Onboarding

The Postman collection demonstrates three different ways to onboard an issuer and the requests can be found in the `Issuer/onboard issuer` folder.  The public and private keys used for issuing and verifying credentials can be supplied in the request body, or they can be omitted and the service will generate them.

### Create DHP Issuer

This request demonstrates creating a DHP issuer where public keys will have a [DID](https://www.w3.org/TR/did-core/) of type `did:dhp`.  This is accomplished by specifying `did:dhp` for the `type` value in the request body.

This also demonstrates supplying the key pair which will be used for issuing and verifying credentials.  The `public_key_cert` value contains the public key certificate and `private_key_cert` contains the private key certificate, both of which must be a string where new lines are represented with `\n`.

`public_key_cert` and `private_key_cert` may be omitted from the request body and the service will automatically generate a key pair.

### Create Web Issuer

This request demonstrates creating a Web issuer where public keys will have a [DID Web](https://w3c-ccg.github.io/did-method-web/) of type `did:web`.  This is accomplished by specifying `did:web` for the `type` value in the request body.  The URL where the DID web will be hosted must be specified in the `url` value in the request body.

This also demonstrates supplying the key pair which will be used for issuing and verifying credentials.  The `public_key_cert` value contains the public key certificate and `private_key_cert` contains the private key certificate, both of which must be a string where new lines are replaced with `\n`.

`public_key_cert` and `private_key_cert` may be omitted from the request body and the service will automatically generate a key pair

### Create DHP Issuer(generate-keys)

This request demonstrates the same functionality as the `Create DHP Issuer` request, except `public_key_cert` and `private_key_cert` are omitted from the request body.  In this case the public and private keys are generated automatically.

[↑ Top](#readme)

## Key Rotation

An issuer's public and private keys can be rotated.  When a key pair is rotated older key pairs are retained to verify any credential issued with them.  Any new credential will be issued using the latest key pair.

Key rotation is demonstrated in the Postman request `Rotate DHP Issuer keys` in the folder `\Issuer\Rotate keys`.

[↑ Top](#readme)

## Schema Creation

A schema must be created before issuing credentials.  A schema is a [JSON Schema](https://json-schema.org/) representation of a credential to be issued.  If the credential request body JSON does not conform to the corresponding schema then the request will be rejected.

Schema creation is demonstrated in the Postman request `Create Schema` in the folder `\Schema`.  This schema represents an IDHP vaccine credential.

## Credential Issuance

Once the schema is created credentials of that type can be issued.  The Postman collection demonstrates issuing three different credentials in the form of JSON, base64 encoded and QR code.  All three requests are in the Postman collection's `Credentials` folder.

### Create Json Credential
This request returns a signed JSON credentail and is accomplished by ether supplying no query params or by specifying query qaram `type=string`.

### Create Encoded Credential
This request returns a signed base64 encoded JSON credential and is accomplished by specifying query param `type=encoded`.

### Create QR Credential
This request returns a QR code image of the signed credential and is accomplished by specifying query param `qrcode`.  The contents of the QR code may be either string (`type=string`) or base64 encoded (`type=encoded`) as described in the previous two requests.

[↑ Top](#readme)

## Credential Verification
Credential verification is demonstrated in the Postman request `Verify Credential` under the `Credentials` folder.  The supplied credential in the request body must be base64 encoded.  The request will always return a status 200 regardless of the credential's status.  The verification response JSON contains the following parts.

```
`payload`: Contains the decrypted base64 credential JSON.
`verification_status`:  A code representing the credential verification status.
`valid`: Returns `true` if the credential is valid and `false` if not valid.
`message:`: A small description of the verification status. 
```

Below are the possible verification results

### Valid Credential

```
{
    "verification_status": "VALID",
    "valid": true,
    "message": "Credential is valid"
}
```

### Tampered Credential

```
{
    "verification_status": "SIGNATURE_INVALID",
    "valid": false,
    "message": "Credential's signature invalid"
}
```

### Revoked Credential

```
{
    "verification_status": "REVOKED",
    "valid": false,
    "message": "Credential has been revoked"
}
```

### Expired Credential

```
{
    "verification_status": "EXPIRED",
    "valid": false,
    "message": "Credential has expired"
}
```

### Failed Credential De-Obfuscation

```
{
    "verification_status": "DEOBFUSCATION_FAILED",
    "valid": false,
    "message": "failed to de-obfuscate credential"
}
```

[↑ Top](#readme)

## Credential Revocation

The Postman request `Revoke Credential` under the `Credentials` folder demonstrates revoking a credential.  Once a credential is revoked it will always fail verification.  The request body must contain the credential’s ID and a reason for the revocation.

[↑ Top](#readme)


## Library Licenses

This section lists open source libraries used in this SDK. 

**Table 3: Libraries and sources for this SDK** 

| Library                   | Source                                                                |
| ------------------------- | --------------------------------------------------------------------- |
| `@azure/cosmos`           | MIT License (https://www.npmjs.com/package/@azure/cosmos)             |
| `@azure/identity`         | MIT License (https://www.npmjs.com/package/@azure/identity)           |
| `@azure/keyvault-secrets` | MIT License (https://www.npmjs.com/package/@azure/keyvault-secrets)   |
| `@cloudant/cloudant`      | Apache License 2.0 (https://www.npmjs.com/package/@cloudant/cloudant) |
| `axios`                   | MIT License (https://www.npmjs.com/package/axios)                     |
| `body-parser`             | MIT License (https://www.npmjs.com/package/body-parser)               |
| `cookie-session`          | MIT License (https://www.npmjs.com/package/cookie-session)            |
| `crypto-js`               | MIT License (https://www.npmjs.com/package/crypto-js)                 |
| `ecdsca-secp256r1`        | MIT License (https://www.npmjs.com/package/ecdsa-secp256r1)           |
| `express`                 | MIT License (https://www.npmjs.com/package/express)                   |
| `helmet`                  | MIT License (https://www.npmjs.com/package/helmet)                    |
| `https`                   | ICS License (https://www.npmjs.com/package/https)                     |
| `ibmcloud-appid`          | Apache License 2.0 (https://www.npmjs.com/package/ibmcloud-appid)     |
| `json-normalize`          | ICS License (https://www.npmjs.com/package/json-normalize)            |
| `jsonpath`                | MIT License (https://www.npmjs.com/package/jsonpath)                  |
| `jsonschema`              | MIT License (https://www.npmjs.com/package/jsonschema)                |
| `jsonwebtoken`            | MIT License (https://www.npmjs.com/package/jsonwebtoken)              |
| `jwt-decode`              | MIT License (https://www.npmjs.com/package/jwt-decode)                |
| `log4js`                  | Apache License 2.0 (https://www.npmjs.com/package/log4js)             |
| `moment`                  | MIT License (https://www.npmjs.com/package/moment)                    |
| `morgan`                  | MIT License (https://www.npmjs.com/package/morgan)                    |
| `nano`                    | Apache License 2.0 (https://www.npmjs.com/package/nano)               |
| `node-jose`               | Apache License 2.0 (https://www.npmjs.com/package/node-jose)          |
| `passport`                | MIT License (https://www.npmjs.com/package/passport)                  |
| `passport-azure-ad`       | MIT License (https://www.npmjs.com/package/passport-azure-ad)         |
| `qrcode`                  | MIT License (https://www.npmjs.com/package/qrcode)                    |
| `query-string`            | MIT License (https://www.npmjs.com/package/query-string)              |
| `retry-axios`             | Apache License 2.0 (https://www.npmjs.com/package/retry-axios)        |
| `source-map-support`      | MIT License (https://www.npmjs.com/package/source-map-support)        |
| `swagger-ui-express`      | MIT License (https://www.npmjs.com/package/swagger-ui-express)        |
| `uuid`                    | MIT License (https://www.npmjs.com/package/uuid)                      |

[↑ Top](#readme)
