const express = require('express');
const router = express.Router();
const catchErrors = require('express-catch-errors');

const { connect } = require('../controller/socket.controller');

router.get('/connect', catchErrors(connect));

module.exports = router;
