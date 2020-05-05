const express = require('express');
const router = express.Router();
const catchErrors = require('express-catch-errors');

const { listVideos, rebuildDatabase, updateViewCount, find, stream } = require('../controller/video.controller');

router.get('/list', catchErrors(listVideos));
router.get('/build', catchErrors(rebuildDatabase));
router.get('/update-view-count', catchErrors(updateViewCount));
router.get('/find', catchErrors(find));
router.get('/stream', catchErrors(stream));

module.exports = router;
