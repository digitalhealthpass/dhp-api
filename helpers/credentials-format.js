// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

exports.HPASS_CREDENTIALS = {
    "description": "Draft verifiable credential schema using JSON interchange format",
    "type": "object",
    "properties": {
        "@context": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "id": {
            "type": "string"
        },
        "type": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "issuer": {
            "type": "string"
        },
        "issuanceDate": {
            "type": "string",
            "format": "date-time"
        },
        "expirationDate": {
            "type": "string",
            "format": "date-time"
        },
        "credentialSchema": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string"
                },
                "type": {
                    "type": "string"
                },
                "required": [
                    "id",
                    "type"
                ]
            }
        },
        "credentialSubject": {
            "type": "object"
        },
        "obfuscation": {
            "type": "array",
            "items": {
                "type": "object"
            }
        },
        "proof": {
            "type": "object",
            "properties": {
                "created": {
                    "type": "string",
                    "format": "date-time"
                },
                "creator": {
                    "type": "string"
                },
                "nonce": {
                    "type": "string"
                },
                "signatureValue": {
                    "type": "string"
                },
                "type": {
                    "type": "string"
                }
            },
            "required": [
                "created",
                "creator",
                "nonce",
                "signatureValue",
                "type"
            ]
        }
    },
    "required": [
        "@context",
        "id",
        "type",
        "issuer",
        "issuanceDate",
        "credentialSchema",
        "credentialSubject",
        "proof"
    ]
}
