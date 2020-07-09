const mongoose = require('mongoose');
const logger = require("./utils/logger")

const config = require("./config")
const conString = config.dbUrl

mongoose.Promise = global.Promise;

mongoose.connection.on('connected', () => {
  logger.info(`mongoose connected to: '${conString}'`);
});

mongoose.connection.on('disconnected', () => {
  logger.info('mongoose disconnected!');
});

mongoose.connection.on('error', (err) => {
  logger.error(err);
  process.exit(1);
});

async function connect() {
  new Promise((resolve, reject) => {
    mongoose.connect(
      conString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
      .then(() => resolve())
      .catch(err => reject(err));
  })
}

module.exports = {
  connect,
};
