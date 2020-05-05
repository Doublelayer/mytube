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

function get() {
  return mongoose;
}

module.exports = {
  connect,
};

// const Datastore = require('nedb');
// const db = new Datastore({ filename: './persistent/database.db' });

// db.loadDatabase(function(err) {
//   if (err) return console.log(`ERROR: ${err}`);

//   console.log('Database loaded...');
// });

// function removeAllDocs() {
//   return new Promise((resolve, reject) => {
//     db.remove({}, { multi: true }, function(err, numRemoved) {
//       if (err) reject(err);
//       resolve(numRemoved);
//     });
//   });
// }

// function insert(...args) {
//   return new Promise((resolve, reject) => {
//     db.insert(...args, function(err, newDocs) {
//       if (err) reject(err);
//       resolve(newDocs.length);
//     });
//   });
// }

// function update(id, args) {
//   return new Promise((resolve, reject) => {
//     db.update({ _id: id }, args, { multi: true }, function(err, numReplaced) {
//       if (err) reject(err);
//       resolve(numReplaced);
//     });
//   });
// }

// function find(findBy, projections) {
//   return new Promise((resolve, reject) => {
//     db.find(findBy, projections, function(err, docs) {
//       if (err) reject(err);
//       resolve(docs);
//     });
//   });
// }

// function findById(id) {
//   return new Promise((resolve, reject) => {
//     db.findOne({ _id: id }, function(err, doc) {
//       if (err) reject(err);

//       resolve(doc);
//     });
//   });
// }
// function getVideos(params) {
//   return new Promise((resolve, reject) => {
//     const { type, projections, sortBy, skip, limit } = params;
//     var cursor = db.find({ type: type }, projections);

//     if (sortBy) cursor.sort(JSON.parse(`${sortBy}`));

//     if (!isNaN(skip)) cursor.skip(parseInt(skip));

//     if (!isNaN(limit)) cursor.limit(parseInt(limit));

//     cursor.exec(function(err, docs) {
//       if (err) reject(err);

//       resolve(docs);
//     });
//   });
// }

// module.exports = { removeAllDocs, insert, find, findById, getVideos, update };
