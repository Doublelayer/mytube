const readdirp = require('readdirp');
const fs = require('fs');
const path = require('path');
const winston = require('winston');
const { getVideoDurationInSeconds } = require('get-video-duration');

const curl = new (require('curl-request'))();

function generateMovieMetaData(path, fileFilter) {
  return new Promise(async (resolve, reject) => {
    const settings = {
      type: 'files',
      fileFilter: fileFilter,
    };

    const items = [];

    readdirp
      .promise(path, settings)
      .then(async (files) => {
        for (const entry of files) {
          await createVideoItem(entry).then((item) => items.push(item));
        }
      })
      .then(() => resolve(items))
      .catch((err) => reject(err));
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
        parent: path.dirname(entry.fullPath).split(path.sep).pop(),
        path: entry.fullPath,
        streamUrl: `http://localhost:5000/api/v1/video/stream`,
        publishedAt: stats.birthtime,
        duration: await getVideoDuration(entry.fullPath),
        thumbnail: 'await getThumbnail(file)',
        itemInfo: {
          title: path.basename(entry.fullPath, path.extname(file)),
          description: '...',
        },
        statistics: {
          viewCount: 0,
        },
      };

      resolve(item);
    } catch (error) {
      winston.error(`Could not read "${entry.fullPath}" \nError: ${error}`);
      reject(error);
    }
  });
}

async function getVideoDuration(path) {
  try {
    return await getVideoDurationInSeconds(path);
  } catch (error) {
    return 0;
  }
}

async function getThumbnail(file) {
  try {
    const stream = fs.createReadStream(file);
  } catch (error) {
    console.log(error);
  }
  await curl
    .setHeaders(['Content-Type: multipart/form-data'])
    .setMultipartBody([
      {
        name: 'filename',
        contents: 'yourimage.png',
      },
      {
        name: 'file',
        file: stream,
      },
    ])
    .post('http://127.0.0.1:9025/screenshot')
    .then(({ statusCode, body, headers }) => {
      fs.writeFile('./image.png', body, function (err) {
        if (err) throw err;
      });
      // console.log(statusCode, body, headers);
      return '';
    })

    .catch((e) => {
      console.log('error: ', e);
      return '';
    });
}

module.exports = { generateMovieMetaData };
