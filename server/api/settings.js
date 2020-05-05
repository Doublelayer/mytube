const express = require('express');
const router = express.Router();
const catchErrors = require('express-catch-errors');

const { listConfig, createConfig } = require('../controller/config.controller');

router.get('/list', catchErrors(listConfig));
router.post('/create', catchErrors(createConfig));

module.exports = router;
