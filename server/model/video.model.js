const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const VideoSchema = new mongoose.Schema({
  type: { type: String, default: 'video' },
  extname: { type: String },
  parent: { type: String, required: true },
  path: { type: String, required: true },
  publishedAt: { type: String, required: true },
  duration: { type: String, required: true },
  thumbnail: { type: String, required: true },
  itemInfo: {
    title: { type: String, required: true },
    description: { type: String },
  },
  statistics: {
    viewCount: { type: Number, default: 0 },
  },
  created_at: { type: Date, default: Date.now },
});

VideoSchema.plugin(mongoosePaginate);

const Video = mongoose.model('Videos', VideoSchema);

module.exports = Video;
