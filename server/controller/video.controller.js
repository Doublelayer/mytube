const Video = require('../model/video.model');
const Config = require('../model/config.model');
const winston = require('winston');
const { logger } = require('../utils/logger');
const fs = require('fs');
const scanner = require('../utils/video.scanner');

module.exports.listVideos = async (req, res) => {
  const options = {
    page: req.body.nextPage,
    limit: req.body.limit,
    projection: req.body.projection,
  };

  await Video.paginate({}, options, (err, docs) => {
    if (err) {
      winston.error(err);
      res.status(400).send({ ERROR: `There was an Error while generating documents`, IFNO: err });
    } else {
      res.status(200).json(docs);
    }
  });
};

module.exports.findBy = async (req, res) => {
  logger.debug(JSON.stringify(req.body));
  await Video.find(req.body, (err, docs) => {
    if (err) {
      winston.error(err);
      res.status(400).send({ ERROR: `There was an Error while generating documents`, IFNO: err });
    } else {
      res.status(200).json(docs);
    }
  });
};

module.exports.updateViewCount = async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).send('ID required!');

  await Video.findById(id, (err, doc) => {
    if (err) {
      winston.error(err);
      res.status(400).send({ ERROR: `There was an Error while generating documents`, IFNO: err });
    } else {
      const newViewCount = ++doc.statistics.viewCount;
      Video.updateOne({ _id: doc._id }, { $set: { statistics: { viewCount: newViewCount } } }, (err, raw) => {
        if (err) {
          winston.error(err);
          res.status(400).send({ ERROR: `There was an Error while generating documents`, IFNO: err });
        } else {
          res.status(200).json({ message: `update viewcount for ${doc._id} to ${newViewCount}` });
        }
      });
    }
  });
};

module.exports.find = async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).send('ID required!');

  await Video.findById(id, (err, doc) => {
    if (err) {
      winston.error(err);
      res.status(400).send({ ERROR: `Item with '${id}' not found!`, IFNO: err });
    } else {
      res.status(200).json(doc);
    }
  });
};

module.exports.thumbnail = async (req, res) => {
  const id = req.params.id;
  winston.info(id);
  if (!id) return res.status(400).send('ID required!');

  await Video.findOne({ _id: id }, (err, doc) => {
    if (err) {
      winston.error(err);
      res.status(400).send({ ERROR: `Item with '${id}' not found!`, IFNO: err });
    } else {
      const img = Buffer.from(doc.thumbnail, 'base64');
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length,
      });
      res.end(img);
    }
  });
};

/*
   This Endpoint will generate video items and store it in the database
   1. It removes all documents from the database
   2. It generate the metadata of all found videos
   3. It will try to stored it in the database
 
   On Succsess : Status 200, Message with inserted docs count
   On Failure  : Status 400, Message with error info
*/
module.exports.rebuildDatabase = async (req, res) => {
  logger.info('start to rebuild database');

  const result = await Video.deleteMany({}).catch((error) => {
    logger.error(error);
    res.status(500).send({ ERROR: `an unexpected error occurs while deleting from database`, IFNO: error });
  });

  logger.info(`${result.deletedCount} documents from video collection removed`);

  const config = await Config.findOne({}).catch((err) => {
    logger.error(err);
    res.status(500).send({ ERROR: `can't find config file`, IFNO: error });
  });

  logger.debug(`Config: ${config}`);
  const filter = {
    type: config.videos.fileType,
    fileFilter: config.videos.extName,
  };

  const files = await scanner.getFilesFromDirectory(config.root, filter);

  logger.info(`${files.length} files found in '${config.root}'`);

  var insertCount = 0;
  const failedFiles = [];
  const successFiles = [];

  for (const file of files) {
    const metaData = await scanner.generateMovieMetaData(file);

    await createVideoEntry(metaData)
      .then((doc) => {
        logger.info(`new file from ${doc.path} inserted`);
        successFiles.push(doc.path);
        insertCount++;
      })
      .catch((err) => {
        logger.error(err);
        failedFiles.push({ ERROR: err.errors, FILE: file.path });
      });
  }

  const success = files.length === insertCount;
  logger.debug(`${insertCount} documents to video collection inserted`);
  logger.debug(`all successfull : ${success}`);
  res.status(200).json({
    success: success,
    message: `found ${files.length} files and stored ${insertCount}`,
    filter_used: config.videos.filter,
    failedFiles: failedFiles,
    successFiles: successFiles,
  });
};

async function createVideoEntry(metaData) {
  return new Promise((resolve, reject) => {
    Video.create(metaData)
      .then((doc) => resolve(doc))
      .catch((err) => reject(err));
  });
}

module.exports.stream = async (req, res) => {
  const movie = await Video.findById(req.params.id);

  if (!movie) return res.status(404).send(`Video by ID: '${req.query.id}' not found`);

  const path = movie.path;
  var stat;
  try {
    stat = fs.statSync(path);
  } catch (error) {
    return res.status(500).send(`Cannot accsess file under ${path}`);
  }
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
      return;
    }

    const chunksize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
};
