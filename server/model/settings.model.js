const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema(
  {
    root: { type: String, required: true },
    videos: {
      extName: { type: Array, required: true },
      fileType: { type: String, required: true },
    },

    created_at: { type: Date, default: Date.now },
  },
  {
    collection: 'settings',
    capped: { size: 1024, max: 1 },
  }
);

const DirectoryTreeSchema = new mongoose.Schema({
  root: { type: String, required: true },
  inserted: { type: Array, required: false },
  filter: {
    extName: { type: Array, required: true },
  },
  tree: { type: Object, required: true },

  created_at: { type: Date, default: Date.now },
});

const Settings = mongoose.model('Settings', SettingsSchema);
const DirectoryTree = mongoose.model('Tree', DirectoryTreeSchema);

module.exports = { Settings, DirectoryTree };
