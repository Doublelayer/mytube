const readdirp = require('readdirp');
const fs = require('fs');
const Path = require('path');
const { logger } = require('./logger');
const { getVideoDurationInSeconds } = require('get-video-duration');

const FormData = require('form-data');
const fetch = require('node-fetch');

module.exports.getFilesFromDirectory = async (rootPath, filter) => {
  return await readdirp.promise(rootPath, filter);
};

module.exports.generateMovieMetaData = (entry) => {
  return new Promise(async (resolve, reject) => {
    try {
      const file = Path.resolve(entry.fullPath);
      const stats = fs.statSync(file);
      const extName = Path.extname(file);
      const fileName = Path.basename(entry.fullPath, extName);

      const item = {
        type: 'video',
        extname: extName,
        parent: Path.dirname(entry.fullPath).split(Path.sep).pop(),
        path: entry.fullPath,
        publishedAt: stats.birthtime,
        duration: await getVideoDuration(entry.fullPath),
        thumbnail: await getThumbnail(file, fileName),
        itemInfo: {
          title: fileName,
          description: '...',
        },
        statistics: {
          viewCount: 0,
        },
      };

      resolve(item);
    } catch (error) {
      logger.error(`Could not read "${entry.fullPath}" \nError: ${error}`);
      reject(error);
    }
  });
};

async function getThumbnail(file, fileName) {
  return new Promise(async (resolve, reject) => {
    const stream = fs.createReadStream(file);
    const url = 'http://127.0.0.1:9025/screenshot';

    const formData = new FormData();
    formData.append('file', stream);

    logger.info(`starting to create thumbnail for '${fileName}'`);

    await fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.buffer())
      .then((buffer) => {
        logger.info(`sucessfully create thumbnail for '${fileName}'`);
        resolve(buffer.toString('base64'));
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function getVideoDuration(path) {
  try {
    return await getVideoDurationInSeconds(path);
  } catch (error) {
    return 0;
  }
}
