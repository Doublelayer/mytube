const fs = require('fs');
const Path = require('path');
const logger = require('./logger');
const { getVideoDurationInSeconds } = require('get-video-duration');
const FormData = require('form-data');
const fetch = require('node-fetch');
const dree = require('dree');

const toUpper = function (x) {
  return x.toUpperCase();
};

const toLower = function (x) {
  return x.toLowerCase();
};

module.exports.getFilesFromDirectory = async (rootPath, filter) => {
  return new Promise(async (resolve, reject) => {
    logger.debug(`Root: ${rootPath} | Filter: ${filter}`);
    const upperCase = filter.map(toUpper);
    const lowerCase = filter.map(toLower);

    const options = {
      extensions: upperCase.concat(lowerCase),
      excludeEmptyDirectories: true,
      showHidden: true,
      size: false,
      hash: false,
      sizeInBytes: false,
    };

    dree
      .scanAsync(rootPath, options)
      .then(function (tree) {
        resolve(tree);
      })
      .catch((err) => reject(err));
  });
};

module.exports.generateMovieMetaData = (entry, treeId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const file = Path.resolve(entry);
      const stats = fs.statSync(file);
      const extName = Path.extname(file);
      const fileName = Path.basename(entry, extName);

      const item = {
        treeId: treeId,
        type: 'video',
        extname: extName,
        parent: Path.dirname(entry).split(Path.sep).pop(),
        path: entry,
        publishedAt: stats.birthtime,
        duration: await getVideoDuration(entry),
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
