// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'ok',
    });
});

module.exports = router;
