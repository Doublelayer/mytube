const express = require('express');
const settings = require('./settings');
const videos = require('./videos');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/settings', settings);
router.use('/video', videos);

module.exports = router;
