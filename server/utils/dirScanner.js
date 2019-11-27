const readdirp = require('readdirp');
const fs = require('fs');
const path = require('path');
const { getVideoDurationInSeconds } = require('get-video-duration');

function generateMovieMetaData(basepath) {
  return new Promise(async (resolve, reject) => {
    try {
      const items = [];
      const settings = {
        type: 'files',
        fileFilter: ['*.mp4']
      };

      const files = await readdirp.promise(basepath, settings);

      for (const entry of files) {
        const file = path.resolve(entry.fullPath);
        const stats = fs.statSync(file);

        items.push({
          type: 'video',
          extname: path.extname(file),
          parent: path
            .dirname(entry.fullPath)
            .split(path.sep)
            .pop(),
          path: entry.fullPath,
          streamUrl: `http://localhost:5000/stream/`,
          publishedAt: stats.birthtime,
          duration: await getVideoDurationInSeconds(entry.fullPath),
          itemInfo: {
            title: path.basename(entry.fullPath, path.extname(file)),
            description: '...'
          },
          statistics: {
            viewCount: '0'
          }
        });
      }

      resolve(items);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generateMovieMetaData };
