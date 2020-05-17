const mongoose = require('mongoose');
const winston = require('winston');

const { MONGODB_URI } = require('./config');

mongoose.Promise = global.Promise;

mongoose.connection.on('connected', () => {
  winston.info('Mongoose connected!');
});

mongoose.connection.on('disconnected', () => {
  winston.info('Mongoose disconnected!');
});

mongoose.connection.on('error', (err) => {
  winston.error(err.message);
  process.exit(1);
});

function connect(callback) {
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    callback();
  });
}

module.exports = {
  connect,
};
