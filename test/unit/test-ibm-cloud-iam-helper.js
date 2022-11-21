// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

/* eslint-disable no-empty-function */
/* eslint-disable class-methods-use-this */
/* eslint-disable node/no-unpublished-require */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-classes-per-file */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const nock = require('nock');

const iamHelper = require('../../helpers/ibm-cloud-iam-helper');

const { expect } = chai;
const { assert } = chai;
chai.use(chaiAsPromised);

describe('test getCloudIAMToken()', () => {
    // unhappy before happy because the helper caches the good token
    it('unhappy get IAM token - iam responds 500', async () => {
        nock('https://iam.cloud.ibm.com/identity', { allowUnmocked: false })
            .post('/token')
            .reply(500, 'Some error');

        try {
            await iamHelper.getCloudIAMToken();
        } catch (error) {
            expect(error.message).to.equal(
                'Failed to get Cloud IAM token: Some error'
            );
            expect(error.status).to.equal(500);
            return;
        }
        assert.isOk(false, 'Exception was not thrown');
    });

    it('happy get IAM token', async () => {
        const iamData = {
            // eslint-disable-next-line max-len
            "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2Njc0MjAzMzksImV4cCI6MjAxNDU3NTUzOSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSJ9.ljeZowQE_3FBCo9FB5gp4vxqpVHfhBLu-n1bP8pl76M",
        }

        nock('https://iam.cloud.ibm.com/identity', { allowUnmocked: false })
            .post('/token')
            .reply(200, iamData);

        const token = await iamHelper.getCloudIAMToken();
        expect(token).to.equal(iamData.access_token);
    });
});
