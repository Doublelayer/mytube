const express = require('express');
const settings = require('./settings.video');
const videos = require('./videos');
const socket = require('./socket');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'welcome to mylocaltube',
  });
});

router.use('/settings/video', settings);
router.use('/video', videos);
router.use('/socket-event', socket);

module.exports = router;
