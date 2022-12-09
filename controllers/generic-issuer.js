// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const dccIssuers = require('../resources/dcc_issuers.json');
const vciIssuers = require('../resources/vci_issuers.json');

// TODO: implement
const getDccIssuers = (req, res) => {
    return res.status(200).json({
        payload: dccIssuers,
        status: 200,
    });
}

// TODO: implement
const getVciIssuers = (req, res) => {
    return res.status(200).json({
        payload: vciIssuers,
        status: 200,
    });
}

module.exports = {
    getDccIssuers,
    getVciIssuers,
}
