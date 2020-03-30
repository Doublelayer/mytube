const readdirp = require('readdirp');
const fs = require('fs');
const path = require('path');
const { getVideoDurationInSeconds } = require('get-video-duration');
const db = require('../database');

function generateMovieMetaData(basepath) {
  return new Promise(async (resolve, reject) => {
    try {
      insertedCount = 0;
      const settings = {
        type: 'files',
        fileFilter: ['*.mp4', '*.flv', '*.ogv', '*.webm', '*.mpg', '*.avi', '*.wmv', '*.mov', '*.mts', '*.mkv', '*.MOV']
      };

      const files = await readdirp.promise(basepath, settings);

      for (const entry of files) {
        const item = await createVideoItem(entry)
          .then(item => {
            db.insert(item)
              .then(() => {
                insertedCount++;
                console.log(`Insert new Item: ${item.itemInfo.title}${item.extname}`);
              })
              .catch(err => {
                console.log(`Failed to store item: ${item.itemInfo.title}.${item.extname}\nError: ${err} `);
              });
          })
          .catch(err => {
            console.log(`Failed to store item: ${item.itemInfo.title}.${item.extname}\nError: ${err} `);
          });
      }

      resolve(insertedCount);
    } catch (error) {
      reject(error);
    }
  });
}

async function createVideoItem(entry) {
  return new Promise(async (resolve, reject) => {
    try {
      const file = path.resolve(entry.fullPath);
      const stats = fs.statSync(file);

      const item = {
        type: 'video',
        extname: path.extname(file),
        parent: path
          .dirname(entry.fullPath)
          .split(path.sep)
          .pop(),
        path: entry.fullPath,
        streamUrl: `http://localhost:5000/stream/`,
        publishedAt: stats.birthtime,
        duration: await getVideoDuration(entry.fullPath),
        thumbnail: `http://localhost:5000/stream/`,
        itemInfo: {
          title: path.basename(entry.fullPath, path.extname(file)),
          description: '...'
        },
        statistics: {
          viewCount: 0
        }
      };
      resolve(item);
    } catch (error) {
      console.log(`Could not read "${entry.fullPath}" \nError: ${error}`);
      reject(error);
    }
  });
}

async function getVideoDuration(path) {
  try {
    return await getVideoDurationInSeconds(path);
  } catch (error) {
    return null;
  }
}

module.exports = { generateMovieMetaData };
