const express = require('express');
const cors = require('cors');
const errorhandler = require('errorhandler');
const morgan = require('morgan')
const bodyParser = require('body-parser');
const path = require('path');

const { isProduction } = require('./config');

const middlewares = require('./middlewares');

const api = require('./api');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

if (!isProduction) {
  app.use(errorhandler({ dumpExceptions: true, showStack: true }));
}

app.get('/', (req, res) => {
  res.json({
    message: 'welcome to mylocaltube',
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
