const express = require('express');
const cors = require('cors');
const errorhandler = require('errorhandler');
const bodyParser = require('body-parser');
const path = require('path');

const { IS_PRODUCTION } = require('./config');

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

if (!IS_PRODUCTION) {
  app.use(errorhandler());
}

app.get('/', (req, res) => {
  console.log('sdfas');
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
