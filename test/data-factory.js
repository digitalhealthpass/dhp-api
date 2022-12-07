// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

/* eslint-disable max-len */

const issuerId = 'hpass.integration1';

const jsonCredential = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1"
    ],
    "credentialSchema": {
        "id": "did:dhp:eda79af0650d3b8d66c3072e5b046123c76b1a48440f0d719a6de7f18c5420ec:b9e1fa9393aaa6173685856c15784fcf6cc23c145ad5198d4d918512ddaa2f52;id=idhp-vaccination;version=0.3",
        "type": "JsonSchemaValidator2019"
    },
    "credentialSubject": {
        "batchNumber": "12345",
        "countryOfVaccination": "us",
        "dateOfVaccination": "2022-09-14",
        "disease": "COVID-19",
        "display": "#32CD32",
        "doseNumber": 2,
        "dosesPerCycle": 2,
        "marketingAuthorizationHolder": "Pfizer Inc",
        "medicinalProductCode": "208",
        "recipient": {
            "birthDate": "2000-10-10",
            "familyName": "Smith",
            "givenName": "Jane",
            "middleName": "Sarah"
        },
        "stateOfVaccination": "ca",
        "type": "Vaccination Card"
    },
    "expirationDate": "2032-09-28T15:52:47Z",
    "id": "did:dhp:eda79af0650d3b8d66c3072e5b046123c76b1a48440f0d719a6de7f18c5420ec:b9e1fa9393aaa6173685856c15784fcf6cc23c145ad5198d4d918512ddaa2f52;vc-f603c658-980b-49a1-8365-b5b1b17d74c9",
    "issuanceDate": "2022-12-07T18:32:16Z",
    "issuer": "did:dhp:eda79af0650d3b8d66c3072e5b046123c76b1a48440f0d719a6de7f18c5420ec:b9e1fa9393aaa6173685856c15784fcf6cc23c145ad5198d4d918512ddaa2f52",
    "proof": {
        "created": "2022-12-07T18:32:16Z",
        "creator": "did:dhp:eda79af0650d3b8d66c3072e5b046123c76b1a48440f0d719a6de7f18c5420ec:b9e1fa9393aaa6173685856c15784fcf6cc23c145ad5198d4d918512ddaa2f52-key1",
        "nonce": "47632a7a-7961-4a0e-a002-6c9353f01c47",
        "type": "EcdsaSecp256r1Signature2019",
        "signatureValue": "CQM8z7Ze060qHTIp7+SBROyZgl06dmoyIk3A2TNlGtrhTq1scHxiEhBppkIsje54VCrSBjFWYDbGR5nDanrV6A=="
    },
    "type": [
        "IBMDigitalHealthPass",
        "Vaccination",
        "VerifiableCredential"
    ]
}

const obfuscatedJsonCredential = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1"
    ],
    "credentialSchema": {
        "id": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723;id=idhp-vaccination;version=0.3",
        "type": "JsonSchemaValidator2019"
    },
    "credentialSubject": {
        "batchNumber": "12345",
        "countryOfVaccination": "us",
        "dateOfVaccination": "2022-09-14",
        "disease": "COVID-19",
        "display": "#32CD32",
        "doseNumber": 2,
        "dosesPerCycle": 2,
        "marketingAuthorizationHolder": "Pfizer Inc",
        "medicinalProductCode": "208",
        "recipient": {
            "birthDate": "nKmcHGCyuXcS1POQxVzrJX6SiL0/a/RxFTnTE5Zj5tc=",
            "familyName": "JIbZewLeHRbebflGYtQlHR5IYjyr4f/w4qU+tp9gcNk=",
            "givenName": "jjHP33Ip07hLWgo30/+rKmT2bFMLGOt4FDckRT48RZ4=",
            "middleName": "PeRNgOaF7pphHINfgOimmOkiSJUZoa0Nz9z3/fA95/Y="
        },
        "stateOfVaccination": "ca",
        "type": "Vaccination Card"
    },
    "expirationDate": "2032-09-28T15:52:47Z",
    "id": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723;vc-b13d63dc-ea53-404c-aad8-e925a2b7068c",
    "issuanceDate": "2022-11-03T19:06:00Z",
    "issuer": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723",
    "proof": {
        "created": "2022-11-03T19:06:00Z",
        "creator": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723-key1",
        "nonce": "cfdc6dbf-53dd-452b-b772-0677fe834714",
        "type": "EcdsaSecp256r1Signature2019",
        "signatureValue": "eAMPitb8gkW1y3rBDW2oTnKyv/PIkEYIIQdM1xGfm9esFr1hsSHhTnIfJwJ9AOCeeovS5YC8L3YhvZBxJID9CQ=="
    },
    "type": [
        "IBMDigitalHealthPass",
        "Vaccination",
        "VerifiableCredential"
    ],
    "obfuscation": [
        {
            "val": "Jane",
            "alg": "HS256",
            "nonce": "23ceZcHrrv/EstTu80M5jC3/gtak1DHVgsHlEtmzJ10=",
            "path": "recipient.givenName"
        },
        {
            "val": "Sarah",
            "alg": "HS256",
            "nonce": "ZT/vTaMkSwphCF0QliQMcdSE9Oe6zmSC6w6vG2CFKfU=",
            "path": "recipient.middleName"
        },
        {
            "val": "Smith",
            "alg": "HS256",
            "nonce": "CBypXyBsyH0JV8RQg3KM70znKzOfGLYZgOR9Rj+W8kc=",
            "path": "recipient.familyName"
        },
        {
            "val": "2000-10-10",
            "alg": "HS256",
            "nonce": "RUW3Swl2ChWfezVppnLtGwg/jQM8RGQku5wGRCGTiBc=",
            "path": "recipient.birthDate"
        }
    ]
}

const encodedCredential = 'eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiZGlkOmRocDplZGE3OWFmMDY1MGQzYjhkNjZjMzA3MmU1YjA0NjEyM2M3NmIxYTQ4NDQwZjBkNzE5YTZkZTdmMThjNTQyMGVjOmI5ZTFmYTkzOTNhYWE2MTczNjg1ODU2YzE1Nzg0ZmNmNmNjMjNjMTQ1YWQ1MTk4ZDRkOTE4NTEyZGRhYTJmNTI7aWQ9aWRocC12YWNjaW5hdGlvbjt2ZXJzaW9uPTAuMyIsInR5cGUiOiJKc29uU2NoZW1hVmFsaWRhdG9yMjAxOSJ9LCJjcmVkZW50aWFsU3ViamVjdCI6eyJiYXRjaE51bWJlciI6IjEyMzQ1IiwiY291bnRyeU9mVmFjY2luYXRpb24iOiJ1cyIsImRhdGVPZlZhY2NpbmF0aW9uIjoiMjAyMi0wOS0xNCIsImRpc2Vhc2UiOiJDT1ZJRC0xOSIsImRpc3BsYXkiOiIjMzJDRDMyIiwiZG9zZU51bWJlciI6MiwiZG9zZXNQZXJDeWNsZSI6MiwibWFya2V0aW5nQXV0aG9yaXphdGlvbkhvbGRlciI6IlBmaXplciBJbmMiLCJtZWRpY2luYWxQcm9kdWN0Q29kZSI6IjIwOCIsInJlY2lwaWVudCI6eyJiaXJ0aERhdGUiOiIyMDAwLTEwLTEwIiwiZmFtaWx5TmFtZSI6IlNtaXRoIiwiZ2l2ZW5OYW1lIjoiSmFuZSIsIm1pZGRsZU5hbWUiOiJTYXJhaCJ9LCJzdGF0ZU9mVmFjY2luYXRpb24iOiJjYSIsInR5cGUiOiJWYWNjaW5hdGlvbiBDYXJkIn0sImV4cGlyYXRpb25EYXRlIjoiMjAzMi0wOS0yOFQxNTo1Mjo0N1oiLCJpZCI6ImRpZDpkaHA6ZWRhNzlhZjA2NTBkM2I4ZDY2YzMwNzJlNWIwNDYxMjNjNzZiMWE0ODQ0MGYwZDcxOWE2ZGU3ZjE4YzU0MjBlYzpiOWUxZmE5MzkzYWFhNjE3MzY4NTg1NmMxNTc4NGZjZjZjYzIzYzE0NWFkNTE5OGQ0ZDkxODUxMmRkYWEyZjUyO3ZjLWY2MDNjNjU4LTk4MGItNDlhMS04MzY1LWI1YjFiMTdkNzRjOSIsImlzc3VhbmNlRGF0ZSI6IjIwMjItMTItMDdUMTg6MzI6MTZaIiwiaXNzdWVyIjoiZGlkOmRocDplZGE3OWFmMDY1MGQzYjhkNjZjMzA3MmU1YjA0NjEyM2M3NmIxYTQ4NDQwZjBkNzE5YTZkZTdmMThjNTQyMGVjOmI5ZTFmYTkzOTNhYWE2MTczNjg1ODU2YzE1Nzg0ZmNmNmNjMjNjMTQ1YWQ1MTk4ZDRkOTE4NTEyZGRhYTJmNTIiLCJwcm9vZiI6eyJjcmVhdGVkIjoiMjAyMi0xMi0wN1QxODozMjoxNloiLCJjcmVhdG9yIjoiZGlkOmRocDplZGE3OWFmMDY1MGQzYjhkNjZjMzA3MmU1YjA0NjEyM2M3NmIxYTQ4NDQwZjBkNzE5YTZkZTdmMThjNTQyMGVjOmI5ZTFmYTkzOTNhYWE2MTczNjg1ODU2YzE1Nzg0ZmNmNmNjMjNjMTQ1YWQ1MTk4ZDRkOTE4NTEyZGRhYTJmNTIta2V5MSIsIm5vbmNlIjoiNDc2MzJhN2EtNzk2MS00YTBlLWEwMDItNmM5MzUzZjAxYzQ3IiwidHlwZSI6IkVjZHNhU2VjcDI1NnIxU2lnbmF0dXJlMjAxOSIsInNpZ25hdHVyZVZhbHVlIjoiQ1FNOHo3WmUwNjBxSFRJcDcrU0JST3laZ2wwNmRtb3lJazNBMlRObEd0cmhUcTFzY0h4aUVoQnBwa0lzamU1NFZDclNCakZXWURiR1I1bkRhbnJWNkE9PSJ9LCJ0eXBlIjpbIklCTURpZ2l0YWxIZWFsdGhQYXNzIiwiVmFjY2luYXRpb24iLCJWZXJpZmlhYmxlQ3JlZGVudGlhbCJdfQ==';

const expiredCredential = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1"
    ],
    "credentialSchema": {
        "id": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723;id=idhp-vaccination;version=0.3",
        "type": "JsonSchemaValidator2019"
    },
    "credentialSubject": {
        "batchNumber": "12345",
        "countryOfVaccination": "us",
        "dateOfVaccination": "2022-09-14",
        "disease": "COVID-19",
        "display": "#32CD32",
        "doseNumber": 2,
        "dosesPerCycle": 2,
        "marketingAuthorizationHolder": "Pfizer Inc",
        "medicinalProductCode": "208",
        "recipient": {
            "birthDate": "2000-10-10",
            "familyName": "Smith",
            "givenName": "Jane",
            "middleName": "Sarah"
        },
        "stateOfVaccination": "ca",
        "type": "Vaccination Card"
    },
    "expirationDate": "2022-11-03T19:09:00Z",
    "id": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723;vc-cd8cb28b-058a-4649-9237-30c62c569360",
    "issuanceDate": "2022-11-03T19:08:48Z",
    "issuer": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723",
    "proof": {
        "created": "2022-11-03T19:08:48Z",
        "creator": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723-key1",
        "nonce": "d450738a-050c-4605-9a28-5acbe7d51b48",
        "type": "EcdsaSecp256r1Signature2019",
        "signatureValue": "ncIrGjNDD/cyD5Bdbfs8JK0FUaemzMNfUvRPtKRzTRY4w2ORSvyk+PzpIPJfI5lnUz2NQtchku2GPqxvEKSftA=="
    },
    "type": [
        "IBMDigitalHealthPass",
        "Vaccination",
        "VerifiableCredential"
    ]
}

const credentialRequestBody = {
    "schemaID": "did:dhp:eda79af0650d3b8d66c3072e5b046123c76b1a48440f0d719a6de7f18c5420ec:b9e1fa9393aaa6173685856c15784fcf6cc23c145ad5198d4d918512ddaa2f52;id=idhp-vaccination;version=0.3",
    "type": [
        "IBMDigitalHealthPass",
        "Vaccination"
    ],
    "data": {
        "type": "Vaccination Card",
        "display": "#32CD32",
        "recipient": {
            "givenName": "Jane",
            "middleName": "Sarah",
            "familyName": "Smith",
            "birthDate": "2000-10-10"
        },
        "disease": "COVID-19",
        "medicinalProductCode": "208",
        "marketingAuthorizationHolder": "Pfizer Inc",
        "dateOfVaccination": "2022-09-14",
        "doseNumber": 2,
        "dosesPerCycle": 2,
        "batchNumber": "12345",
        "stateOfVaccination": "ca",
        "countryOfVaccination": "us"
    },
    "expirationDate": "2032-09-28T15:52:47Z"
}

const vcLoginCredential = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1"
    ],
    "credentialSchema": {
        "id": "did:dhp:eda79af0650d3b8d66c3072e5b046123c76b1a48440f0d719a6de7f18c5420ec:b9e1fa9393aaa6173685856c15784fcf6cc23c145ad5198d4d918512ddaa2f52;id=verifierlogin;version=0.7",
        "type": "JsonSchemaValidator2019"
    },
    "credentialSubject": {
        "configId": "id:latest",
        "configName": "Name of configuration",
        "customer": "Richard Scott",
        "customerId": "customerId",
        "name": "Richard Scott",
        "organization": "rmscott-org",
        "organizationId": "rmscott-orgid",
        "type": "VerifierCredential",
        "verifierType": "verfierType"
    },
    "expirationDate": "2033-01-01T00:00:00Z",
    "id": "did:dhp:eda79af0650d3b8d66c3072e5b046123c76b1a48440f0d719a6de7f18c5420ec:b9e1fa9393aaa6173685856c15784fcf6cc23c145ad5198d4d918512ddaa2f52;vc-31adb501-6a1b-49e6-8aa9-9a5f39869a1c",
    "issuanceDate": "2022-12-07T18:58:45Z",
    "issuer": "did:dhp:eda79af0650d3b8d66c3072e5b046123c76b1a48440f0d719a6de7f18c5420ec:b9e1fa9393aaa6173685856c15784fcf6cc23c145ad5198d4d918512ddaa2f52",
    "proof": {
        "created": "2022-12-07T18:58:45Z",
        "creator": "did:dhp:eda79af0650d3b8d66c3072e5b046123c76b1a48440f0d719a6de7f18c5420ec:b9e1fa9393aaa6173685856c15784fcf6cc23c145ad5198d4d918512ddaa2f52-key1",
        "nonce": "1c678220-e2c3-4bbe-a31b-e055104de9e1",
        "type": "EcdsaSecp256r1Signature2019",
        "signatureValue": "T30e1/T3LKzgSSoHw+uKP8O3FLEdJWYRGYd1UsDWjydvocN95p7Ana+DBi6Yqx43lsXjr+vnEeVnXXM3bDAdDg=="
    },
    "type": [
        "VerifierCredential",
        "VerifiableCredential"
    ]
}

const schema = {
    "_id": "did:dhp:eda79af0650d3b8d66c3072e5b046123c76b1a48440f0d719a6de7f18c5420ec:b9e1fa9393aaa6173685856c15784fcf6cc23c145ad5198d4d918512ddaa2f52;id=idhp-vaccination;version=0.3",
    "_rev": "1-be18c36780aae9c8a27bf522b1c0a764",
    "@type": "https://w3c-ccg.github.io/vc-json-schemas/schema/1.0/schema.json",
    "author": "did:dhp:eda79af0650d3b8d66c3072e5b046123c76b1a48440f0d719a6de7f18c5420ec:b9e1fa9393aaa6173685856c15784fcf6cc23c145ad5198d4d918512ddaa2f52",
    "authorName": "Digital Health Pass Issuer",
    "authored": "2022-12-07T18:26:36Z",
    "modelVersion": "0.3",
    "name": "Proof of Vaccination",
    "proof": {
        "created": "2022-12-07T18:26:36Z",
        "creator": "hpass.integration1-kp",
        "nonce": "222be965-986c-4f5e-a20e-81b034a3c9c0",
        "type": "EcdsaSecp256r1Signature2019",
        "signatureValue": "0r1xQ5ZaoOnCCExJtohs8BHy2tQy8wxpjUl32iIFmxMf8pBCsTqGHiD1f8me+UKOI7hQvXKI8yk54FEefCzSiA=="
    },
    "schema": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "properties": {
            "booster": {
                "type": "boolean"
            },
            "countryOfVaccination": {
                "system": "https://www.iso.org/iso-3166-country-codes.html",
                "type": "string"
            },
            "dateOfVaccination": {
                "displayValue": {
                    "de": "Impfdatum",
                    "en": "Vaccination Date"
                },
                "format": "date",
                "type": "string"
            },
            "disease": {
                "displayValue": {
                    "de": "Zielkrankheit",
                    "en": "Target Disease"
                },
                "type": "string"
            },
            "display": {
                "description": "Card background color.",
                "pattern": "#\\w{6}",
                "type": "string",
                "visible": false
            },
            "doseNumber": {
                "maxLength": 2,
                "minLength": 1,
                "type": "integer"
            },
            "dosesPerCycle": {
                "maxLength": 2,
                "minLength": 1,
                "type": "integer"
            },
            "marketingAuthorizationHolder": {
                "displayValue": {
                    "de": "Hersteller",
                    "en": "Manufacturer"
                },
                "type": "string"
            },
            "medicinalProductCode": {
                "displayValue": {
                    "de": "Impfstoff-Code",
                    "en": "Vaccine Code"
                },
                "type": "string"
            },
            "medicinalProductName": {
                "displayValue": {
                    "de": "Impfstoff",
                    "en": "Vaccine"
                },
                "type": "string"
            },
            "recipient": {
                "properties": {
                    "birthDate": {
                        "displayValue": {
                            "de": "Geburtsdatum",
                            "en": "Date of Birth"
                        },
                        "format": "date",
                        "pattern": "([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1]))?)?",
                        "type": "string",
                        "visible": true
                    },
                    "familyName": {
                        "displayValue": {
                            "de": "Nachname",
                            "en": "Surname"
                        },
                        "maxLength": 100,
                        "minLength": 1,
                        "type": "string",
                        "visible": true
                    },
                    "givenName": {
                        "displayValue": {
                            "de": "Vorname",
                            "en": "First Name"
                        },
                        "maxLength": 100,
                        "minLength": 1,
                        "type": "string",
                        "visible": true
                    },
                    "identity": {
                        "properties": {
                            "DL": {
                                "displayValue": {
                                    "de": "",
                                    "en": "Driver's license number"
                                },
                                "maxLength": 50,
                                "minLength": 1,
                                "type": "string",
                                "visible": true
                            },
                            "MR": {
                                "displayValue": {
                                    "de": "",
                                    "en": "Medical record number"
                                },
                                "maxLength": 50,
                                "minLength": 1,
                                "type": "string",
                                "visible": true
                            },
                            "OTH": {
                                "displayValue": {
                                    "de": "",
                                    "en": "Other ID"
                                },
                                "maxLength": 50,
                                "minLength": 1,
                                "type": "string",
                                "visible": true
                            },
                            "PPN": {
                                "displayValue": {
                                    "de": "",
                                    "en": "Passport number"
                                },
                                "maxLength": 50,
                                "minLength": 1,
                                "type": "string",
                                "visible": true
                            }
                        },
                        "type": "object"
                    },
                    "middleName": {
                        "maxLength": 100,
                        "minLength": 1,
                        "type": "string",
                        "visible": true
                    }
                },
                "required": [
                    "givenName",
                    "familyName",
                    "birthDate"
                ],
                "type": "object"
            },
            "stateOfVaccination": {
                "system": "https://pe.usps.com/text/pub28/28apb.htm",
                "type": "string"
            },
            "type": {
                "maxLength": 100,
                "minLength": 1,
                "type": "string",
                "visible": false
            },
            "vaccinationHistory": {
                "items": {
                    "properties": {
                        "dateOfVaccination": {
                            "displayValue": {
                                "de": "Impfdatum",
                                "en": "Vaccination Date"
                            },
                            "format": "date",
                            "type": "string"
                        },
                        "medicinalProductCode": {
                            "displayValue": {
                                "de": "Impfstoff-Code",
                                "en": "Vaccine Code"
                            },
                            "type": "string"
                        }
                    },
                    "required": [
                        "medicinalProductCode",
                        "dateOfVaccination"
                    ],
                    "type": "object"
                },
                "minItems": 1,
                "type": "array"
            }
        },
        "required": [
            "type",
            "recipient",
            "medicinalProductCode",
            "marketingAuthorizationHolder",
            "doseNumber",
            "dosesPerCycle",
            "dateOfVaccination",
            "countryOfVaccination",
            "disease"
        ],
        "type": "object"
    },
    "version": "0.3"
}

const createSchemaBody = {
    "@type": "https://w3c-ccg.github.io/vc-json-schemas/schema/1.0/schema.json",
    "version": "0.3",
    "id": "idhp-vaccination",
    "name": "Proof of Vaccination",
    "schema": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "properties": {
            "booster": {
                "type": "boolean"
            },
            "countryOfVaccination": {
                "system": "https://www.iso.org/iso-3166-country-codes.html",
                "type": "string"
            },
            "dateOfVaccination": {
                "displayValue": {
                    "de": "Impfdatum",
                    "en": "Vaccination Date"
                },
                "format": "date",
                "type": "string"
            },
            "disease": {
                "displayValue": {
                    "de": "Zielkrankheit",
                    "en": "Target Disease"
                },
                "type": "string"
            },
            "display": {
                "description": "Card background color.",
                "pattern": "#\\w{6}",
                "type": "string",
                "visible": false
            },
            "doseNumber": {
                "maxLength": 2,
                "minLength": 1,
                "type": "integer"
            },
            "dosesPerCycle": {
                "maxLength": 2,
                "minLength": 1,
                "type": "integer"
            },
            "marketingAuthorizationHolder": {
                "displayValue": {
                    "de": "Hersteller",
                    "en": "Manufacturer"
                },
                "type": "string"
            },
            "medicinalProductCode": {
                "displayValue": {
                    "de": "Impfstoff-Code",
                    "en": "Vaccine Code"
                },
                "type": "string"
            },
            "medicinalProductName": {
                "displayValue": {
                    "de": "Impfstoff",
                    "en": "Vaccine"
                },
                "type": "string"
            },
            "recipient": {
                "properties": {
                    "birthDate": {
                        "displayValue": {
                            "de": "Geburtsdatum",
                            "en": "Date of Birth"
                        },
                        "format": "date",
                        "pattern": "([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1]))?)?",
                        "type": "string",
                        "visible": true
                    },
                    "familyName": {
                        "displayValue": {
                            "de": "Nachname",
                            "en": "Surname"
                        },
                        "maxLength": 100,
                        "minLength": 1,
                        "type": "string",
                        "visible": true
                    },
                    "givenName": {
                        "displayValue": {
                            "de": "Vorname",
                            "en": "First Name"
                        },
                        "maxLength": 100,
                        "minLength": 1,
                        "type": "string",
                        "visible": true
                    },
                    "identity": {
                        "properties": {
                            "DL": {
                                "displayValue": {
                                    "de": "",
                                    "en": "Driver's license number"
                                },
                                "maxLength": 50,
                                "minLength": 1,
                                "type": "string",
                                "visible": true
                            },
                            "MR": {
                                "displayValue": {
                                    "de": "",
                                    "en": "Medical record number"
                                },
                                "maxLength": 50,
                                "minLength": 1,
                                "type": "string",
                                "visible": true
                            },
                            "OTH": {
                                "displayValue": {
                                    "de": "",
                                    "en": "Other ID"
                                },
                                "maxLength": 50,
                                "minLength": 1,
                                "type": "string",
                                "visible": true
                            },
                            "PPN": {
                                "displayValue": {
                                    "de": "",
                                    "en": "Passport number"
                                },
                                "maxLength": 50,
                                "minLength": 1,
                                "type": "string",
                                "visible": true
                            }
                        },
                        "type": "object"
                    },
                    "middleName": {
                        "maxLength": 100,
                        "minLength": 1,
                        "type": "string",
                        "visible": true
                    }
                },
                "required": [
                    "givenName",
                    "familyName",
                    "birthDate"
                ],
                "type": "object"
            },
            "stateOfVaccination": {
                "system": "https://pe.usps.com/text/pub28/28apb.htm",
                "type": "string"
            },
            "type": {
                "maxLength": 100,
                "minLength": 1,
                "type": "string",
                "visible": false
            },
            "vaccinationHistory": {
                "items": {
                    "properties": {
                        "dateOfVaccination": {
                            "displayValue": {
                                "de": "Impfdatum",
                                "en": "Vaccination Date"
                            },
                            "format": "date",
                            "type": "string"
                        },
                        "medicinalProductCode": {
                            "displayValue": {
                                "de": "Impfstoff-Code",
                                "en": "Vaccine Code"
                            },
                            "type": "string"
                        }
                    },
                    "required": [
                        "medicinalProductCode",
                        "dateOfVaccination"
                    ],
                    "type": "object"
                },
                "minItems": 1,
                "type": "array"
            }
        },
        "required": [
            "type",
            "recipient",
            "medicinalProductCode",
            "marketingAuthorizationHolder",
            "doseNumber",
            "dosesPerCycle",
            "dateOfVaccination",
            "countryOfVaccination",
            "disease"
        ],
        "type": "object"
    },
    "authorName": "Digital Health Pass Issuer"
};

const vcLoginSchema = {
    "_id": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723;id=verifierlogin;version=0.7",
    "_rev": "3-1b108516eba7f20fec755d19dd5b8058",
    "@type": "https://w3c-ccg.github.io/vc-json-schemas/schema/1.0/schema.json",
    "author": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723",
    "authored": "2022-11-03T19:18:04Z",
    "modelVersion": "0.7",
    "name": "Verifier Credential for login",
    "proof": {
        "created": "2022-11-03T19:18:04Z",
        "creator": "hpass.integration1-kp",
        "nonce": "4e4171b2-c89c-4773-b270-cd5215038e90",
        "type": "EcdsaSecp256r1Signature2019",
        "signatureValue": "0bpq8nf+eS1AoQsNhJf+LvVXMcXOrnQJxVq+1JAKt3+EMIX6F2JruKy7yg0OqNl5ApFxv+fwDoKO2sJSRZuyZA=="
    },
    "schema": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "properties": {
            "configId": {
                "type": "string",
                "visible": false
            },
            "configName": {
                "type": "string",
                "visible": true
            },
            "customer": {
                "type": "string",
                "visible": true
            },
            "customerId": {
                "type": "string",
                "visible": false
            },
            "name": {
                "type": "string",
                "visible": true
            },
            "organization": {
                "type": "string",
                "visible": true
            },
            "organizationId": {
                "type": "string",
                "visible": false
            },
            "type": {
                "type": "string",
                "visible": false
            },
            "verifierType": {
                "description": "Verifier types defined by customer.",
                "type": "string",
                "visible": true
            }
        },
        "required": [
            "name",
            "customer",
            "customerId",
            "organization",
            "organizationId",
            "type",
            "configId",
            "configName"
        ],
        "type": "object"
    },
    "version": "0.7"
}

const keyPair = {
    "_id": "hpass.integration1-kp",
    "_rev": "5-381fbd65b87458f1b694af2e1322ace1",
    "keys": [
        {
            "kty": "EC",
            "kid": "PL56Y5H3-o1UuV0PRyZrwW8ISrSs3IlLS4_GiJZ3OF0",
            "x5t": "e9nMrtPo9MmyCgg2kgHnnEdCFg4",
            "crv": "P-256",
            "x": "gIqCFdO4khnUkHedck2quJezlv4NLHjcXZXx_HZcfoE",
            "y": "MVFhBNaQRIeu0hsUqF9Aan3JjhmP3cujfKhAhpWPg_4"
        },
        {
            "kty": "EC",
            "kid": "PL56Y5H3-o1UuV0PRyZrwW8ISrSs3IlLS4_GiJZ3OF0",
            "crv": "P-256",
            "x": "gIqCFdO4khnUkHedck2quJezlv4NLHjcXZXx_HZcfoE",
            "y": "MVFhBNaQRIeu0hsUqF9Aan3JjhmP3cujfKhAhpWPg_4",
            "d": "WJjckiP1Zt1OM0HQ0UVOngTSWxEZNjPNT6wr2F3gGeE"
        }
    ],
    "creator": "did:dhp:eda79af0650d3b8d66c3072e5b046123c76b1a48440f0d719a6de7f18c5420ec:b9e1fa9393aaa6173685856c15784fcf6cc23c145ad5198d4d918512ddaa2f52",
    "version": 1
}

const issuer = {
    "_id": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723",
    "_rev": "5-501ff8ed1da312e476479bc730b11506",
    "@context": [
        "https://www.w3.org/ns/did/v1"
    ],
    "publicKey": [
        {
            "id": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723-key1",
            "type": "secp256r1",
            "controller": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723",
            "publicKeyJwk": {
                "kty": "EC",
                "kid": "PL56Y5H3-o1UuV0PRyZrwW8ISrSs3IlLS4_GiJZ3OF0",
                "x5t": "e9nMrtPo9MmyCgg2kgHnnEdCFg4",
                "crv": "P-256",
                "x": "gIqCFdO4khnUkHedck2quJezlv4NLHjcXZXx_HZcfoE",
                "y": "MVFhBNaQRIeu0hsUqF9Aan3JjhmP3cujfKhAhpWPg_4"
            }
        }
    ]
}

const createIssuerBody = {
    "type": "did:dhp",
    "url": "merative.com",
    "issuerId": "hpass.integration1",
    "public_key_cert": "-----BEGIN CERTIFICATE-----\nMIIBCTCBsAIJAIyxl50b0PpzMAoGCCqGSM49BAMCMA0xCzAJBgNVBAYTAlVTMB4X\nDTIyMDkyNzE0MjAwN1oXDTMyMDkyNDE0MjAwN1owDTELMAkGA1UEBhMCVVMwWTAT\nBgcqhkjOPQIBBggqhkjOPQMBBwNCAASAioIV07iSGdSQd51yTaq4l7OW/g0seNxd\nlfH8dlx+gTFRYQTWkESHrtIbFKhfQGp9yY4Zj93Lo3yoQIaVj4P+MAoGCCqGSM49\nBAMCA0gAMEUCICuw9SDwiW5PTISM+GcbCg5OXmWYk6xWE9xs0bnFrZTtAiEA4/8c\nftBK5gaTCjZuJCqhI1FNfXja9C6I3k2CuSfU6Rg=\n-----END CERTIFICATE-----",
    "private_key_cert": "-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIFiY3JIj9WbdTjNB0NFFTp4E0lsRGTYzzU+sK9hd4BnhoAoGCCqGSM49\nAwEHoUQDQgAEgIqCFdO4khnUkHedck2quJezlv4NLHjcXZXx/HZcfoExUWEE1pBE\nh67SGxSoX0BqfcmOGY/dy6N8qECGlY+D/g==\n-----END EC PRIVATE KEY-----",
    "name": "Test hospital"
}

module.exports = {
    jsonCredential,
    obfuscatedJsonCredential,
    encodedCredential,
    expiredCredential,
    credentialRequestBody,
    vcLoginCredential,
    schema,
    createSchemaBody,
    vcLoginSchema,
    keyPair,
    issuer,
    createIssuerBody,
    issuerId,
}
