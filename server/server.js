const fs = require('fs');
const _ = require('underscore');

const db = require('./database');
const helpers = require('./utils/helpers');
const dirScanner = require('./utils/dirScanner');

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.get('/api/hello', (req, res) => {
  res.status(200).send(`App is listening on Port: ${port} `);
});

app.get('/pagination', (req, res) => {
  db.pagination();
});

app.get('/find', (req, res) => {
  const id = req.query.id;

  db.find({ _id: id }, { path: 0, type: 0, extname: 0 })
    .then(doc => {
      res.status(200).json(doc);
    })
    .catch(err => {
      res.status(400).json([{ ERROR: `There was an Error while deleting documents`, IFNO: err }]);
    });
});

app.get('/all', (req, res) => {
  db.find({}, { path: 0, type: 0, extname: 0 })
    .then(docs => {
      res.status(200).json({ videos: { info: { totalResults: docs.length }, docs } });
    })
    .catch(err => {
      res.status(400).json([{ ERROR: `There was an Error while deleting documents`, IFNO: err }]);
    });
});

/* 
  This Endpoint removes all documents from the databas (DEV-MODE only!)

  On Success: Status 200, Message with the count of removed documents
  On Failure: Status 400, Message with error info
*/
app.get('/reset-db', (req, res) => {
  if (!helpers.isDevMode()) return res.status(405).json('Dev mode only');

  db.removeAllDocs()
    .then(numRemoved => {
      res.status(200).send(`Successfully created ${numRemoved} Documents and stored in Database...`);
    })
    .catch(err => {
      res.status(400).json([{ ERROR: `There was an Error while deleting documents`, IFNO: err }]);
    });
});

/* 
   This Endpoint will generate video items and store it in the databse (DEV-Mode only!)
   1. It removes all documents from the database
   2. It generate the metadata of all found videos
   3. It will try to stored it in the database

   On Succsess : Status 200, Message with inserted docs count
   On Failure  : Status 400, Message with error info
*/
app.get('/generate', async (req, res) => {
  // if (!helpers.isDevMode()) return res.status(405).json('Dev mode only');

  db.removeAllDocs();

  basePath = 'C:\\Users\\Florin Hamann\\Documents\\Development\\directory-tree\\01_Videos';

  await dirScanner.generateMovieMetaData(basePath).then(items => {
    db.insert(items)
      .then(insertedCount => {
        res.status(200).send(`Successfully inserted ${insertedCount}`);
      })
      .catch(err => {
        res.status(400).json([{ ERROR: `There was an Error while inserting documents`, IFNO: err }]);
      });
  });
});

app.get('/stream', async (req, res) => {
  // const movie = _.where(moviesData.videos.items, { id: parseInt(req.params.id) });
  const movie = await db.findById(req.query.id);

  if (!movie) return res.status(404).send('Not found...');

  const path = movie.path;
  const stat = fs.statSync(path);
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
      'Content-Type': 'video/mp4'
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4'
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
