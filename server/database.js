const Datastore = require('nedb');
const db = new Datastore({ filename: './persistent/database.db' });

db.loadDatabase(function(err) {
  if (err) return console.log(`ERROR: ${err}`);

  console.log('Database loaded...');
});

function removeAllDocs() {
  return new Promise((resolve, reject) => {
    db.remove({}, { multi: true }, function(err, numRemoved) {
      if (err) reject(err);
      resolve(numRemoved);
    });
  });
}

function insert(...args) {
  return new Promise((resolve, reject) => {
    db.insert(...args, function(err, newDocs) {
      if (err) reject(err);
      resolve(newDocs.length);
    });
  });
}

function find(findBy, projections) {
  return new Promise((resolve, reject) => {
    db.find(findBy, projections, function(err, docs) {
      if (err) reject(err);

      resolve(docs);
    });
  });
}

function findById(id) {
  return new Promise((resolve, reject) => {
    db.findOne({ _id: id }, function(err, doc) {
      if (err) reject(err);

      resolve(doc);
    });
  });
}

function pagination() {
  db.find({})
    .sort({ publishedAt: -1 })
    .skip(1)
    .limit(2)
    .exec(function(err, docs) {
      // docs is [doc3, doc1]
      console.log(docs);
    });
}

module.exports = { removeAllDocs, insert, find, findById, pagination };
