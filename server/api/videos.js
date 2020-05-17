const express = require('express');
const router = express.Router();
const catchErrors = require('express-catch-errors');

const { listVideos, rebuildDatabase, updateViewCount, find, findBy, stream, thumbnail } = require('../controller/video.controller');

router.post('/list', catchErrors(listVideos));
router.get('/build', catchErrors(rebuildDatabase));
router.get('/update-view-count', catchErrors(updateViewCount));
router.get('/find/:id', catchErrors(find));
router.get('/stream/:id', catchErrors(stream));
router.get('/thumbnail/:id', catchErrors(thumbnail));
router.post('/findBy', catchErrors(findBy));

module.exports = router;
