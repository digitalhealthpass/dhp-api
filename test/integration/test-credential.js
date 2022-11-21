// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

/* eslint-disable max-lines-per-function */
const chai = require('chai');
const chaiHTTP = require('chai-http');
const { v4: uuidv4 } = require('uuid');

const { app: server } = require('../../app');
const dataFactory = require('../data-factory');
const common = require('./common');

const { expect } = chai;
chai.use(chaiHTTP);

const contextRoot = process.env.CONTEXT_ROOT;
const { issuerId } = dataFactory;

describe('Credential endpoints', function test() {
    this.timeout(10000);

    let token;
    const revokedId = `did:dhp:${uuidv4()}`

    before(common.waitForServerStart);

    before(common.login);

    before((done) => {
        token = common.getToken();
        done();
    });

    describe('POST /', function test() {
        it('happy create json credential', (done) => {
            chai.request(server)
                .post(`${contextRoot}/credentials/`)
                .set('Authorization', `Bearer ${token}`)
                .set('x-hpass-issuer-id', issuerId)
                .query({ type: 'string' })
                .send(dataFactory.credentialRequestBody)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    const actualCred = res.body.payload

                    encodedCred = Buffer
                        .from(JSON.stringify(actualCred))
                        .toString('base64');

                    const expectedCred = JSON.parse(
                        JSON.stringify(dataFactory.jsonCredential)
                    );
                    delete expectedCred.id;
                    delete expectedCred.issuanceDate;
                    delete expectedCred.proof;

                    delete actualCred.id;
                    delete actualCred.issuanceDate;
                    delete actualCred.proof;

                    expect(actualCred).to.deep.equal(expectedCred);
                    done();
                });
        });

        it('happy create encoded credential', (done) => {
            chai.request(server)
                .post(`${contextRoot}/credentials/`)
                .set('Authorization', `Bearer ${token}`)
                .set('x-hpass-issuer-id', issuerId)
                .query({ type: 'encoded' })
                .send(dataFactory.credentialRequestBody)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);

                    const decoded = JSON.parse(
                        Buffer.from(res.body.payload, 'base64').toString()
                    );

                    const expectedCred = JSON.parse(
                        JSON.stringify(dataFactory.jsonCredential)
                    );
                    delete expectedCred.id;
                    delete expectedCred.issuanceDate;
                    delete expectedCred.proof;

                    delete decoded.id;
                    delete decoded.issuanceDate;
                    delete decoded.proof;

                    expect(decoded).to.deep.equal(expectedCred);
                    done();
                });
        });

        it('happy create json qr code', (done) => {
            chai.request(server)
                .post(`${contextRoot}/credentials/`)
                .set('Authorization', `Bearer ${token}`)
                .set('x-hpass-issuer-id', issuerId)
                .query({ type: 'string', output: 'qrcode' })
                .send(dataFactory.credentialRequestBody)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    done();
                });
        });

        it('happy create encoded qr code', (done) => {
            chai.request(server)
                .post(`${contextRoot}/credentials/`)
                .set('Authorization', `Bearer ${token}`)
                .set('x-hpass-issuer-id', issuerId)
                .query({ type: 'string', output: 'qrcode' })
                .send(dataFactory.credentialRequestBody)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    done();
                });
        });

        it('unhappy create credential - messing issuer id header',
            (done) => {
                chai.request(server)
                    .post(`${contextRoot}/credentials/`)
                    .set('Authorization', `Bearer ${token}`)
                    .query({ type: 'string', output: 'qrcode' })
                    .send(dataFactory.credentialRequestBody)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(400);
                        expect(res.body.message).to.equal(
                            'Missing request header x-hpass-issuer-id'
                        );
                        done();
                    });
            });

        it('unhappy create credential - unknown type', (done) => {
            chai.request(server)
                .post(`${contextRoot}/credentials/`)
                .set('Authorization', `Bearer ${token}`)
                .set('x-hpass-issuer-id', issuerId)
                .query({ type: 'unknown', output: 'qrcode' })
                .send(dataFactory.credentialRequestBody)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal(
                        'Unsupported output type: unknown'
                    );
                    done();
                });
        });

        it('unhappy create credential - unknown output', (done) => {
            chai.request(server)
                .post(`${contextRoot}/credentials/`)
                .set('Authorization', `Bearer ${token}`)
                .set('x-hpass-issuer-id', issuerId)
                .query({ type: 'string', output: 'unknown' })
                .send(dataFactory.credentialRequestBody)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal(
                        'Query param output must equal qrcode. Otherwise, exclude the query param'
                    );
                    done();
                });
        });

        it('unhappy create credential - missing body', (done) => {
            chai.request(server)
                .post(`${contextRoot}/credentials/`)
                .set('Authorization', `Bearer ${token}`)
                .set('x-hpass-issuer-id', issuerId)
                .query({ type: 'encoded', output: 'qrcode' })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal(
                        'Request body required'
                    );
                    done();
                });
        });

        it('unhappy create credential - body missing schemaID', (done) => {
            const body = JSON.parse(JSON.stringify(
                dataFactory.credentialRequestBody
            ));
            delete body.schemaID;

            chai.request(server)
                .post(`${contextRoot}/credentials/`)
                .set('Authorization', `Bearer ${token}`)
                .set('x-hpass-issuer-id', issuerId)
                .query({ type: 'encoded', output: 'qrcode' })
                .send(body)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal(
                        'Missing schemaID from JSON body'
                    );
                    done();
                });
        });

        it('unhappy create credential - body missing type', (done) => {
            const body = JSON.parse(JSON.stringify(
                dataFactory.credentialRequestBody
            ));
            delete body.type;

            chai.request(server)
                .post(`${contextRoot}/credentials/`)
                .set('Authorization', `Bearer ${token}`)
                .set('x-hpass-issuer-id', issuerId)
                .query({ type: 'encoded', output: 'qrcode' })
                .send(body)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal(
                        'Missing type from JSON body'
                    );
                    done();
                });
        });

        it('unhappy create credential - body missing data', (done) => {
            const body = JSON.parse(JSON.stringify(
                dataFactory.credentialRequestBody
            ));
            delete body.data;

            chai.request(server)
                .post(`${contextRoot}/credentials/`)
                .set('Authorization', `Bearer ${token}`)
                .set('x-hpass-issuer-id', issuerId)
                .query({ type: 'encoded', output: 'qrcode' })
                .send(body)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal(
                        'Missing data from JSON body'
                    );
                    done();
                });
        });

        it('unhappy create credential - type in body not an array',
            (done) => {
                const body = JSON.parse(JSON.stringify(
                    dataFactory.credentialRequestBody
                ));
                body.type = 'not an array';

                chai.request(server)
                    .post(`${contextRoot}/credentials/`)
                    .set('Authorization', `Bearer ${token}`)
                    .set('x-hpass-issuer-id', issuerId)
                    .query({ type: 'encoded', output: 'qrcode' })
                    .send(body)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(400);
                        expect(res.body.message).to.equal(
                            'type must be an array'
                        );
                        done();
                    });
            });
    });

    describe('POST /verify', function test() {
        it('happy verify credential', (done) => {
            chai.request(server)
                .post(`${contextRoot}/credentials/verify`)
                .set('Authorization', `Bearer ${token}`)
                .set('x-hpass-issuer-id', issuerId)
                .send({
                    credential: dataFactory.encodedCredential
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    const payload = res.body.payload;

                    expect(payload.verification_status)
                        .to.equal('VALID');
                    expect(payload.valid).to.be.true
                    expect(payload.message)
                        .to.equal('Credential is valid');

                    const expectedCred = JSON.parse(
                        JSON.stringify(dataFactory.jsonCredential)
                    );
                    const actualCred = payload.credential;

                    delete expectedCred.id;
                    delete expectedCred.issuanceDate;
                    delete expectedCred.proof;

                    delete actualCred.id;
                    delete actualCred.issuanceDate;
                    delete actualCred.proof;

                    expect(actualCred)
                        .to.deep.equal(expectedCred);
                    done();
                });
        });


        it('unhappy verify credential - missing credential from body',
            (done) => {
                chai.request(server)
                    .post(`${contextRoot}/credentials/verify`)
                    .set('Authorization', `Bearer ${token}`)
                    .set('x-hpass-issuer-id', issuerId)
                    .send({ missing: 'credential' })
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(400);
                        expect(res.body.message).to.equal(
                            'Missing credential from JSON body'
                        );
                        done();
                    });
            });
    });

    describe('POST /revoked', function test() {
        it('happy revoke credential', (done) => {
            const body = {
                id: revokedId,
                reason: 'wrong credential'
            };

            chai.request(server)
                .post(`${contextRoot}/credentials/revoked`)
                .set('Authorization', `Bearer ${token}`)
                .set('x-hpass-issuer-id', issuerId)
                .send(body)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it('unhappy revoke credential - revoke already exists',
            (done) => {
                const body = {
                    id: revokedId,
                    reason: 'wrong credential'
                };

                chai.request(server)
                    .post(`${contextRoot}/credentials/revoked`)
                    .set('Authorization', `Bearer ${token}`)
                    .set('x-hpass-issuer-id', issuerId)
                    .send(body)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(409);
                        done();
                    });
            });

        it('unhappy revoke credential - missing body', (done) => {
            chai.request(server)
                .post(`${contextRoot}/credentials/revoked`)
                .set('Authorization', `Bearer ${token}`)
                .set('x-hpass-issuer-id', issuerId)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal(
                        'Request body required'
                    );
                    done();
                });
        });

        it('unhappy revoke credential - body missing id',
            (done) => {
                const body = {
                    reason: 'wrong credential'
                };

                chai.request(server)
                    .post(`${contextRoot}/credentials/revoked`)
                    .set('Authorization', `Bearer ${token}`)
                    .set('x-hpass-issuer-id', issuerId)
                    .send(body)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(400);
                        expect(res.body.message).to.equal(
                            'Missing id from JSON body'
                        );
                        done();
                    });
            });

        it('unhappy revoke credential - body missing reason',
            (done) => {
                const body = {
                    id: revokedId,
                };

                chai.request(server)
                    .post(`${contextRoot}/credentials/revoked`)
                    .set('Authorization', `Bearer ${token}`)
                    .set('x-hpass-issuer-id', issuerId)
                    .send(body)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(400);
                        expect(res.body.message).to.equal(
                            'Missing reason from JSON body'
                        );
                        done();
                    });
            });
    });

    describe('GET /revoked', function test() {
        it('happy get all revoked', (done) => {
            chai.request(server)
                .get(`${contextRoot}/credentials/revoked`)
                .set('Authorization', `Bearer ${token}`)
                .query({ limit: 1, skip: 0 })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body.total_rows).to.equal(1);
                    expect(res.body.limit).to.equal('1');
                    expect(res.body.skip).to.equal('0');
                    expect(res.body.payload.length).to.equal(1);
                    done();
                });
        });

        it('unhappy get all revoked - alpah limit', (done) => {
            chai.request(server)
                .get(`${contextRoot}/credentials/revoked`)
                .set('Authorization', `Bearer ${token}`)
                .query({ limit: 'wrong', skip: 0 })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal(
                        'limit must be a number'
                    );
                    done();
                });
        });

        it('unhappy get all revoked - alpah skip', (done) => {
            chai.request(server)
                .get(`${contextRoot}/credentials/revoked`)
                .set('Authorization', `Bearer ${token}`)
                .query({ limit: 0, skip: 'wrong' })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal(
                        'skip must be a number'
                    );
                    done();
                });
        });
    });

    describe('GET /revoked:did', function test() {
        // Note: This test requires the test 'happy revoke credential' to run first
        it('happy get revoked', (done) => {
            const expected = {
                id: revokedId,
                reason: 'wrong credential'
            }

            chai.request(server)
                .get(`${contextRoot}/credentials/revoked/${revokedId}`)
                .set('Authorization', `Bearer ${token}`)
                .set('x-hpass-issuer-id', issuerId)
                .query({ limit: 1, skip: 0 })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);

                    const actual = res.body.payload;
                    delete actual.rev;

                    expect(actual)
                        .to.deep.equal(expected);
                    done();
                });
        });

        it('unhappy get revoked - missing issuer id header', (done) => {
            const expected = {
                id: revokedId,
                reason: 'wrong credential'
            }

            chai.request(server)
                .get(`${contextRoot}/credentials/revoked/${revokedId}`)
                .set('Authorization', `Bearer ${token}`)
                .query({ limit: 1, skip: 0 })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal(
                        'Missing request header x-hpass-issuer-id'
                    );
                    done();
                });
        });

        it('unhappy get revoked - not found', (done) => {

            chai.request(server)
                .get(`${contextRoot}/credentials/revoked/did:unknown`)
                .set('Authorization', `Bearer ${token}`)
                .set('x-hpass-issuer-id', issuerId)
                .query({ limit: 1, skip: 0 })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(404);

                    expect(res.body.message).to.equal(
                        'Revoked credential not found'
                    );
                    done();
                });
        });
    });
});
