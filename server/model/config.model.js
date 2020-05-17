const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema(
  {
    root: { type: String, required: true },
    videos: {
      extName: { type: Array, required: true },
      fileType: { type: String, required: true },
    },

    created_at: { type: Date, default: Date.now },
  },
  {
    collection: 'config',
    capped: { size: 1024, max: 1 },
  }
);

const Config = mongoose.model('Config', ConfigSchema);

module.exports = Config;
