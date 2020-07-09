const express = require('express');
const router = express.Router();
const catchErrors = require('express-catch-errors');

const { createTreeOrUpdate, listDirectories, activateWatcher, rebuildDatabase } = require('../controller/settings.video.controller');

router.get('/list-directories', catchErrors(listDirectories));
router.post('/create-tree-or-update', catchErrors(createTreeOrUpdate));
router.post('/refresh-tree', catchErrors(createTreeOrUpdate));
router.post('/build', catchErrors(rebuildDatabase));

// endpoint build

router.get('/activate-watcher/:id', catchErrors(activateWatcher));

module.exports = router;
