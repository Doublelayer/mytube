const fs = require('fs');
const _ = require('underscore');
const readdirp = require('readdirp');
const path = require('path');

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const moviesData = require('./config/movies.json');

app.get('/api/hello', (req, res) => {
  let hello = { homehost: 'Hello' };
  res.json(hello);
});

app.get('/videos', function(req, res) {
  res.status(200).json(moviesData);
});

app.get('/generate', (req, res) => {
  //   if (process.env.NODE_ENV !== 'dev') return res.status(405).json('Dev mode only');

  generateMovieMetaData();
  res.status(200).send('Generating metadata. Please wait...');
});

app.get('/stream/:id', function(req, res) {
  const movie = _.where(moviesData.videos.items, { id: parseInt(req.params.id) });

  if (!movie[0]) return res.status(404).send('Not found...');

  const path = movie[0].path;
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

const generateMovieMetaData = function() {
  const basepath = 'C:\\Users\\Florin Hamann\\Documents\\Development\\directory-tree\\01_Videos'; // this will be prepended to the paths found in the structure

  var settings = {
    type: 'files',
    fileFilter: ['*.mp4']
  };

  let id = 0;

  var allFilePaths = { videos: { info: {}, items: [] } };

  readdirp(basepath, settings)
    .on('data', function(entry) {
      file = path.resolve(entry.fullPath);
      stats = fs.statSync(file);

      allFilePaths.videos.items.push({
        id: id,
        type: 'file',
        extname: path.extname(file),
        parent: path
          .dirname(entry.fullPath)
          .split(path.sep)
          .pop(),
        path: entry.fullPath,
        publishedAt: stats.birthtime,
        itemInfo: {
          title: path.basename(entry.fullPath, path.extname(file)),
          description: '...'
        },
        statistics: {
          viewCount: '0'
        }
      });
      id++;
    })
    .on('warn', function(warn) {
      console.log('Warn: ', warn);
    })
    .on('error', function(err) {
      console.log('Error: ', err);
    })
    .on('end', function() {
      console.log(allFilePaths);
      allFilePaths.info = { totalResults: id - 1 };

      fs.writeFile('./config/movies.json', JSON.stringify(allFilePaths, 0, 4), 'utf8', err => {
        if (err) console.log(err);
        else console.log('[MOVIES] File saved');
      });
    });
};

app.listen(port, () => console.log(`Listening on port ${port}`));
