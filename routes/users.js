// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const express = require('express');

const requestLogger = require('../middleware/request-logger');
const userController = require('../controllers/user');

const router = express.Router();

router.post('/login', requestLogger, userController.login);
router.post('/login/azure', requestLogger, userController.loginAzure);
router.post('/login/loginWithCredential', requestLogger, userController.loginWithVC);
module.exports = router;
