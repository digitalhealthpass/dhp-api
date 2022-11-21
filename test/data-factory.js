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
    "expirationDate": "2032-09-28T15:52:47Z",
    "id": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723;vc-a5aca1a2-2015-471f-ab0d-98fabd72a9ba",
    "issuanceDate": "2022-11-03T19:03:16Z",
    "issuer": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723",
    "proof": {
        "created": "2022-11-03T19:03:16Z",
        "creator": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723-key1",
        "nonce": "228aa4c0-9b2e-4cda-bcad-a985f1dc0537",
        "type": "EcdsaSecp256r1Signature2019",
        "signatureValue": "oe/nFzTNrxq3/EFj1IKz0ysD+LD463HGDXmf3+qEzL/2GclvKcNMrOE5FbowyIb9ZshGc+27sK1qxeKRN3hxtQ=="
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

const encodedCredential = 'eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiZGlkOmRocDozY2IxOThmZDQ1YjcxNGUxYTU5ZjcwZjJmOTkyZDk5NjRmZmVmMWNhNGQ4YzBiMWMxYmVkOGU0MDM2NjQzYjYwOjM0YTIyYmQ4N2Q4YmMxYmVkOGYzMTIzYzRhNmMxMjUwYmIxYzMzOGJjMGI5ODkxNGYxNjdiZjI1OGUxNjM3MjM7aWQ9aWRocC12YWNjaW5hdGlvbjt2ZXJzaW9uPTAuMyIsInR5cGUiOiJKc29uU2NoZW1hVmFsaWRhdG9yMjAxOSJ9LCJjcmVkZW50aWFsU3ViamVjdCI6eyJiYXRjaE51bWJlciI6IjEyMzQ1IiwiY291bnRyeU9mVmFjY2luYXRpb24iOiJ1cyIsImRhdGVPZlZhY2NpbmF0aW9uIjoiMjAyMi0wOS0xNCIsImRpc2Vhc2UiOiJDT1ZJRC0xOSIsImRpc3BsYXkiOiIjMzJDRDMyIiwiZG9zZU51bWJlciI6MiwiZG9zZXNQZXJDeWNsZSI6MiwibWFya2V0aW5nQXV0aG9yaXphdGlvbkhvbGRlciI6IlBmaXplciBJbmMiLCJtZWRpY2luYWxQcm9kdWN0Q29kZSI6IjIwOCIsInJlY2lwaWVudCI6eyJiaXJ0aERhdGUiOiIyMDAwLTEwLTEwIiwiZmFtaWx5TmFtZSI6IlNtaXRoIiwiZ2l2ZW5OYW1lIjoiSmFuZSIsIm1pZGRsZU5hbWUiOiJTYXJhaCJ9LCJzdGF0ZU9mVmFjY2luYXRpb24iOiJjYSIsInR5cGUiOiJWYWNjaW5hdGlvbiBDYXJkIn0sImV4cGlyYXRpb25EYXRlIjoiMjAzMi0wOS0yOFQxNTo1Mjo0N1oiLCJpZCI6ImRpZDpkaHA6M2NiMTk4ZmQ0NWI3MTRlMWE1OWY3MGYyZjk5MmQ5OTY0ZmZlZjFjYTRkOGMwYjFjMWJlZDhlNDAzNjY0M2I2MDozNGEyMmJkODdkOGJjMWJlZDhmMzEyM2M0YTZjMTI1MGJiMWMzMzhiYzBiOTg5MTRmMTY3YmYyNThlMTYzNzIzO3ZjLTMwNzZlZjUxLTFkMzItNDgxYi04OTVhLWVhOWJmNGMzNTM3NyIsImlzc3VhbmNlRGF0ZSI6IjIwMjItMTEtMDNUMTk6MDI6MzBaIiwiaXNzdWVyIjoiZGlkOmRocDozY2IxOThmZDQ1YjcxNGUxYTU5ZjcwZjJmOTkyZDk5NjRmZmVmMWNhNGQ4YzBiMWMxYmVkOGU0MDM2NjQzYjYwOjM0YTIyYmQ4N2Q4YmMxYmVkOGYzMTIzYzRhNmMxMjUwYmIxYzMzOGJjMGI5ODkxNGYxNjdiZjI1OGUxNjM3MjMiLCJwcm9vZiI6eyJjcmVhdGVkIjoiMjAyMi0xMS0wM1QxOTowMjozMFoiLCJjcmVhdG9yIjoiZGlkOmRocDozY2IxOThmZDQ1YjcxNGUxYTU5ZjcwZjJmOTkyZDk5NjRmZmVmMWNhNGQ4YzBiMWMxYmVkOGU0MDM2NjQzYjYwOjM0YTIyYmQ4N2Q4YmMxYmVkOGYzMTIzYzRhNmMxMjUwYmIxYzMzOGJjMGI5ODkxNGYxNjdiZjI1OGUxNjM3MjMta2V5MSIsIm5vbmNlIjoiYTFiODU2MGMtMmViNy00ZDJlLThlMzQtYmZiMTczNjIxMGQ2IiwidHlwZSI6IkVjZHNhU2VjcDI1NnIxU2lnbmF0dXJlMjAxOSIsInNpZ25hdHVyZVZhbHVlIjoiVDM0RkN0NlRyaWxnM1dUa0VGT2FnRVJIazJCVXlHY3FRcEFMTzB2dm1rckRya00veUdEZ0JXMnRqRzVKZnZacStsbElBWXRwZHNtbVd0ZnFnVG96Y2c9PSJ9LCJ0eXBlIjpbIklCTURpZ2l0YWxIZWFsdGhQYXNzIiwiVmFjY2luYXRpb24iLCJWZXJpZmlhYmxlQ3JlZGVudGlhbCJdfQ==';

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
    "schemaID": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723;id=idhp-vaccination;version=0.3",
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
        "id": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723;id=verifierlogin;version=0.7",
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
        "type": "id",
        "verifierType": "verfierType"
    },
    "expirationDate": "2033-01-01T00:00:00Z",
    "id": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723;vc-ffd4a31a-5911-4b27-a06e-9caa6fe8e8fb",
    "issuanceDate": "2022-11-03T19:20:10Z",
    "issuer": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723",
    "proof": {
        "created": "2022-11-03T19:20:10Z",
        "creator": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723-key1",
        "nonce": "a7dd4b7e-55d9-43f9-b0ad-5f843f17e8e0",
        "type": "EcdsaSecp256r1Signature2019",
        "signatureValue": "4DOiByrTY0rbC8ezNlmiCocFs3qsT9JD9XEs+pJJ0d/RynW9ZQIPyosNvYGQI96X4jYuX+wmTlfQfCtJnQfOBw=="
    },
    "type": [
        "IBMDigitalHealthPass",
        "VCLogin",
        "VerifiableCredential"
    ]
}

const schema = {
    "_id": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723;id=idhp-vaccination;version=0.3",
    "_rev": "3-c302e74a5c43d0181d1db612914cc4cc",
    "@type": "https://w3c-ccg.github.io/vc-json-schemas/schema/1.0/schema.json",
    "author": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723",
    "authorName": "Digital Health Pass Issuer",
    "authored": "2022-11-03T19:17:59Z",
    "modelVersion": "0.3",
    "name": "Proof of Vaccination",
    "proof": {
        "created": "2022-11-03T19:17:59Z",
        "creator": "hpass.integration1-kp",
        "nonce": "2e1d4e97-5a39-4ea1-b799-6fc687edfd78",
        "type": "EcdsaSecp256r1Signature2019",
        "signatureValue": "xuWISEaw6DCIFleik3u//fXAMGhDSMv8YxqdkBLxxjstvYfk/HEmm//xp22UNmZfiNDsywqHlba+yPD7WrCf2g=="
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
    "creator": "did:dhp:3cb198fd45b714e1a59f70f2f992d9964ffef1ca4d8c0b1c1bed8e4036643b60:34a22bd87d8bc1bed8f3123c4a6c1250bb1c338bc0b98914f167bf258e163723",
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
