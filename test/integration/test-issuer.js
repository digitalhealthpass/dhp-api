// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

/* eslint-disable max-lines-per-function */
const chai = require('chai');
const chaiHTTP = require('chai-http');

const { app: server } = require('../../app');
const dataFactory = require('../data-factory');
const issuerHelper = require('../../helpers/issuer-helper');
const common = require('./common');

const { expect } = chai;

chai.use(chaiHTTP);

const contextRoot = process.env.CONTEXT_ROOT;
const { issuerId } = dataFactory;

describe('Issuer endpoints', function test() {
    this.timeout(10000);

    let token;
    let issuerDid;

    before(common.waitForServerStart);

    before(common.login);

    before((done) => {
        token = common.getToken();
        done();
    });

    before(() => {
        return new Promise(async (resolve) => {
            try {
                const did = await issuerHelper.getIssuerDID(issuerId);
                issuerDid = did;
            } catch (err) {
                if (err.status !== 404) {
                    throw err;
                }
            }

            resolve();
        });
    });

    describe('POST /', () => {
        it('happy create issuer', (done) => {
            // This issuer is already created, so do not run this test
            if (issuerDid) {
                done()
                return;
            }
            chai.request(server)
                .post(`${contextRoot}/issuers/`)
                .set('Authorization', `Bearer ${token}`)
                .send(dataFactory.createIssuerBody)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    issuerDid = res.body.payload.id;
                    done();
                });
        });

        // 409 happy paths below are so because if the
        // issuer didn't already exist status would be 201

        it('happy create issuer - did:dhp missing url', (done) => {
            const body = JSON.parse(
                JSON.stringify(dataFactory.createIssuerBody)
            );

            body.type = 'did:dhp';
            delete body.url;

            chai.request(server)
                .post(`${contextRoot}/issuers/`)
                .set('Authorization', `Bearer ${token}`)
                .send(body)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(409);
                    done();
                });
        });

        it('happy create issuer - missing public key', (done) => {
            const body = JSON.parse(
                JSON.stringify(dataFactory.createIssuerBody)
            );

            delete body.public_key_cert;

            chai.request(server)
                .post(`${contextRoot}/issuers/`)
                .set('Authorization', `Bearer ${token}`)
                .send(body)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(409);
                    done();
                });
        });

        it('happy create issuer - missing private key', (done) => {
            const body = JSON.parse(
                JSON.stringify(dataFactory.createIssuerBody)
            );

            delete body.private_key_cert;

            chai.request(server)
                .post(`${contextRoot}/issuers/`)
                .set('Authorization', `Bearer ${token}`)
                .send(body)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(409);
                    done();
                });
        });

        it('unhappy create issuer - already exists', (done) => {
            const body = dataFactory.createIssuerBody;

            chai.request(server)
                .post(`${contextRoot}/issuers/`)
                .set('Authorization', `Bearer ${token}`)
                .send(body)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(409);

                    expect(res.body.message).to.equal(
                        `Issuer ${issuerId} already exists`
                    );

                    done();
                });
        });

        it('unhappy create issuer - did:web missing url', (done) => {
            const body = JSON.parse(
                JSON.stringify(dataFactory.createIssuerBody)
            );

            body.type = 'did:web';
            delete body.url;

            chai.request(server)
                .post(`${contextRoot}/issuers/`)
                .set('Authorization', `Bearer ${token}`)
                .send(body)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal(
                        'A url value is required for DID type did:web'
                    );
                    done();
                });
        });

        it('unhappy create issuer - body missing type', (done) => {
            const body = JSON.parse(
                JSON.stringify(dataFactory.createIssuerBody)
            );

            delete body.type;

            chai.request(server)
                .post(`${contextRoot}/issuers/`)
                .set('Authorization', `Bearer ${token}`)
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
    });

    describe('GET /', () => {
        it('happy get all issuers', (done) => {
            chai.request(server)
                .get(`${contextRoot}/issuers/`)
                .query({ limit: 1, skip: 0 })
                .set('Authorization', `Bearer ${token}`)
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

        it('unhappy get all issuers - alph limit', (done) => {
            chai.request(server)
                .get(`${contextRoot}/issuers/`)
                .query({ limit: 'wrong', skip: 0 })
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal(
                        'limit must be a number'
                    );
                    done();
                });
        });

        it('unhappy get all issuers - alph skip', (done) => {
            chai.request(server)
                .get(`${contextRoot}/issuers/`)
                .query({ limit: 1, skip: 'wrong' })
                .set('Authorization', `Bearer ${token}`)
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

    describe('GET /:did', () => {
        it('happy get issuer', (done) => {
            chai.request(server)
                .get(`${contextRoot}/issuers/${issuerDid}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);

                    expect(res.body.payload.publicKey[0].controller)
                        .to.equal(issuerDid);
                    expect(res.body.payload.publicKey[0].publicKeyJwk)
                        .to.deep.equal(dataFactory.issuer.publicKey[0].publicKeyJwk);
                    done();
                });
        });

        it('unhappy get issuer - not found', (done) => {
            chai.request(server)
                .get(`${contextRoot}/issuers/did:1234`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(404);
                    expect(res.body.message).to.equal(
                        'Issuer not found'
                    );
                    done();
                });
        });
    });



    describe('PUT /:did/metadata', () => {
        const initialAddress = {
            "address": {
                "street": "111 Main St",
                "city": "Durham",
                "state": "NC",
            }
        };

        const updatedAddress = Object.assign(
            initialAddress.address, { zip: '27715' }
        );

        it('happy put initial metadata', (done) => {
            chai.request(server)
                .put(`${contextRoot}/issuers/${issuerDid}/metadata`)
                .set('Authorization', `Bearer ${token}`)
                .send(initialAddress)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    expect(res.body.payload.id).to.equal(issuerDid);
                    done();
                });
        });

        it('happy get initial metadata', (done) => {
            chai.request(server)
                .get(`${contextRoot}/issuers/${issuerDid}/metadata`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body.payload.address)
                        .to.deep.equal(initialAddress.address);
                    done();
                });
        });


        it('happy put updated metadata', (done) => {
            chai.request(server)
                .put(`${contextRoot}/issuers/${issuerDid}/metadata`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedAddress)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    expect(res.body.payload.id).to.equal(issuerDid);
                    done();
                });
        });

        it('happy get updated metadata', (done) => {
            chai.request(server)
                .get(`${contextRoot}/issuers/${issuerDid}/metadata`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body.payload.address)
                        .to.deep.equal(updatedAddress.address);
                    done();
                });
        });

        it('unhappy put metadata - issuer not found', (done) => {
            chai.request(server)
                .put(`${contextRoot}/issuers/did:dhp:unknown/metadata`)
                .set('Authorization', `Bearer ${token}`)
                .send(initialAddress)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(404);
                    expect(res.body.message).to.equal(
                        'Issuer did did:dhp:unknown not found'
                    );
                    done();
                });
        });

        it('unhappy get metadata', (done) => {
            chai.request(server)
                .get(`${contextRoot}/issuers/did:dhp:unknown/metadata`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(404);
                    expect(res.body.message).to.equal(
                        'Issuer did did:dhp:unknown not found'
                    );
                    done();
                });
        });
    });

    describe('POST /public-keys', () => {
        it('unhappy rotate public keys - no body', (done) => {
            chai.request(server)
                .post(`${contextRoot}/issuers/public-keys`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal(
                        'Request body required'
                    );
                    done();
                });
        });

        it('unhappy rotate public keys - no issuer id', (done) => {
            const body = JSON.parse(
                JSON.stringify(dataFactory.createIssuerBody)
            );

            delete body.issuerId;

            chai.request(server)
                .post(`${contextRoot}/issuers/public-keys`)
                .set('Authorization', `Bearer ${token}`)
                .send(body)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal(
                        'Missing issuerId from JSON body'
                    );
                    done();
                });
        });

        it('unhappy rotate public keys - unknown issuer id', (done) => {
            const body = JSON.parse(
                JSON.stringify(dataFactory.createIssuerBody)
            );

            body.issuerId = 'unknown';

            chai.request(server)
                .post(`${contextRoot}/issuers/public-keys`)
                .set('Authorization', `Bearer ${token}`)
                .send(body)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(404);
                    expect(res.body.message).to.equal(
                        'Issuer unknown is not onboarded'
                    );
                    done();
                });
        });
    });
});
