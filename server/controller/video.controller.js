const Video = require('../model/video.model');
const Config = require('../model/config.model');
const winston = require('winston');
const fs = require('fs');
const scanner = require('../utils/dirScanner');

module.exports.listVideos = async (req, res) => {
  const params = {
    ignore: 'IGNORE',
    sortBy: req.query.$sort,
    limit: req.query.$limit,
    skip: req.query.$skip,
    type: req.query.$type,
    category: req.query.$type,
  };

  await Video.find((err, docs) => {
    if (err) {
      winston.error(err);
      res.status(400).send({ ERROR: `There was an Error while generating documents`, IFNO: err });
    } else {
      res.status(200).json({ info: { totalResults: docs.length }, docs });
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
  const id = req.query.id;
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

/*
   This Endpoint will generate video items and store it in the databse
   1. It removes all documents from the database
   2. It generate the metadata of all found videos
   3. It will try to stored it in the database

   On Succsess : Status 200, Message with inserted docs count
   On Failure  : Status 400, Message with error info
*/
module.exports.rebuildDatabase = async (req, res) => {
  await Video.deleteMany({}, async (err, result) => {
    if (err) {
      winston.error(err);
      res.status(400).send({ ERROR: `There was an Error while generating documents`, IFNO: err });
    } else {
      winston.info(`${result.deletedCount} documents from video collection removed`);
      const doc = await Config.findOne({});

      await scanner.generateMovieMetaData(doc.root, doc.videos.filter).then((items) => {
        Video.insertMany(items, (err, docs) => {
          if (err) {
            winston.error(err);
            res.status(400).send({ ERROR: `There was an Error while generating documents`, IFNO: err });
          } else {
            winston.info(`${docs.length} documents to video collection inserted`);
            res.status(200).json({
              success: true,
              message: `found and stored ${docs.length} videos`,
              filter_used: doc.videos.filter,
            });
          }
        });
      });
    }
  });
};

module.exports.stream = async (req, res) => {
  const movie = await Video.findById(req.query.id);

  if (!movie) return res.status(404).send(`Video with '${req.query.id}' not found`);

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
