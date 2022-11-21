// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

/* eslint-disable max-lines-per-function */
const chai = require('chai');
const chaiHTTP = require('chai-http');

const { app: server } = require('../../app');
const dataFactory = require('../data-factory');
const common = require('./common');

const { expect } = chai;
chai.use(chaiHTTP);

const contextRoot = process.env.CONTEXT_ROOT;
const { issuerId } = dataFactory;

describe('Schema endpoints', function test() {
    this.timeout(10000);

    let token;
    const schemaDID = dataFactory.schema._id;

    before(common.waitForServerStart);

    before(common.login);

    before((done) => {
        token = common.getToken();
        done();
    });

    describe('POST /', function test() {
        it('happy create schema', (done) => {
            chai.request(server)
                .post(`${contextRoot}/schemas/`)
                .set('Authorization', `Bearer ${token}`)
                .set('x-hpass-issuer-id', issuerId)
                .send(dataFactory.createSchemaBody)
                .end((err, res) => {
                    expect(err).to.be.null;
                    if (res.status === 409) {
                        done();
                        return;
                    }
                    expect(res).to.have.status(201);
                    done();
                });
        });

        it('unhappy create schema - missing body', (done) => {
            chai.request(server)
                .post(`${contextRoot}/schemas/`)
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

        it('unhappy create schema - missing issuer id header', (done) => {
            chai.request(server)
                .post(`${contextRoot}/schemas/`)
                .set('Authorization', `Bearer ${token}`)
                .send(dataFactory.createSchemaBody)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal(
                        'Missing request header x-hpass-issuer-id'
                    );
                    done();
                });
        });

        it('unhappy create schema - bad issuer id format', (done) => {
            chai.request(server)
                .post(`${contextRoot}/schemas/`)
                .set('Authorization', `Bearer ${token}`)
                .set('x-hpass-issuer-id', 'bad')
                .send(dataFactory.createSchemaBody)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal(
                        `Issuer id header value must follow the format "orgId.userId"`
                    );
                    done();
                });
        });

        it('unhappy create schema - schema missing id', (done) => {
            const body = JSON.parse(
                JSON.stringify(dataFactory.createSchemaBody)
            );
            
            delete body.id;

            chai.request(server)
                .post(`${contextRoot}/schemas/`)
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

        it('unhappy create schema - schema missing name', (done) => {
            const body = JSON.parse(
                JSON.stringify(dataFactory.createSchemaBody)
            );
            
            delete body.name;

            chai.request(server)
                .post(`${contextRoot}/schemas/`)
                .set('Authorization', `Bearer ${token}`)
                .set('x-hpass-issuer-id', issuerId)
                .send(body)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal(
                        'Missing name from JSON body'
                    );
                    done();
                });
        });

        it('unhappy create schema - schema missing schema', (done) => {
            const body = JSON.parse(
                JSON.stringify(dataFactory.createSchemaBody)
            );
            
            delete body.schema;

            chai.request(server)
                .post(`${contextRoot}/schemas/`)
                .set('Authorization', `Bearer ${token}`)
                .set('x-hpass-issuer-id', issuerId)
                .send(body)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal(
                        'Missing schema from JSON body'
                    );
                    done();
                });
        });

        it('unhappy create schema - schema missing version', (done) => {
            const body = JSON.parse(
                JSON.stringify(dataFactory.createSchemaBody)
            );
            
            delete body.version;

            chai.request(server)
                .post(`${contextRoot}/schemas/`)
                .set('Authorization', `Bearer ${token}`)
                .set('x-hpass-issuer-id', issuerId)
                .send(body)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal(
                        'Missing version from JSON body'
                    );
                    done();
                });
        });
    });

    describe('GET /', function test() {
        it('happy get all schema', (done) => {
            chai.request(server)
                .get(`${contextRoot}/schemas/`)
                .set('Authorization', `Bearer ${token}`)
                .set('x-hpass-issuer-id', issuerId)
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

        it('unhappy get all schema - alpah limit', (done) => {
            chai.request(server)
                .get(`${contextRoot}/schemas/`)
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

        it('unhappy get all schema - alpah skip', (done) => {
            chai.request(server)
                .get(`${contextRoot}/schemas/`)
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

    describe('GET /:schemaId', function test() {
        it('happy schema by id', (done) => {
            chai.request(server)
                .get(`${contextRoot}/schemas/${schemaDID}`)
                .set('Authorization', `Bearer ${token}`)
                .set('x-hpass-issuer-id', issuerId)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body.payload.schema)
                        .to.deep.equal(dataFactory.schema.schema);
                    done();
                });
        });

        it('unhappy schema by id = schema not found', (done) => {
            chai.request(server)
                .get(`${contextRoot}/schemas/did:1234`)
                .set('Authorization', `Bearer ${token}`)
                .set('x-hpass-issuer-id', issuerId)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(404);
                    expect(res.body.message).to.equal(
                        'Schema not found'
                    );
                    done();
                });
        });
    });
});
