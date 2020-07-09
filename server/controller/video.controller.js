const Video = require('../model/video.model');
const winston = require('winston');
const logger = require('../utils/logger');
const fs = require('fs');

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
      logger.error(err);
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
      logger.error(err);
      res.status(400).send('{ ERROR: `There was an Error while wgenerating documents`, IFNO: err }');
    } else {
      const newViewCount = ++doc.statistics.viewCount;
      Video.updateOne({ _id: doc._id }, { $set: { statistics: { viewCount: newViewCount } } }, (err, raw) => {
        if (err) {
          logger.error(err);
          res.status(400).send({ ERROR: `There was an Error while generating documents`, IFNO: err });
        } else {
          res.status(204).json({ message: `update viewcount for ${doc._id} to ${newViewCount}` });
        }
      });
    }
  });
};

module.exports.find = async (req, res) => {
  const id = req.params.id;
  logger.debug(`find -> received id: '${id}'`);
  if (!id) return res.status(400).send('ID required!');

  await Video.findById(id, (err, doc) => {
    if (err) {
      logger.error(err);
      res.status(404).send({ msg: 'not found' });
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
