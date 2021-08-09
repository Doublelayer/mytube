const { Config, DirectoryTree } = require('../model/settings.model');
const Video = require('../model/video.model');

const logger = require('../utils/logger');

const scanner = require('../utils/video.scanner');
const getDateTime = require('../utils/dateTime');

// const FileObserver = require('../services/observer');

// const Observer = new FileObserver().getInstance();
// const watcher = require('chokidar');
// // const watcher = chokidar.watch("")

module.exports.listDirectories = async (req, res) => {
  DirectoryTree.find()
    .then((trees) => {
      res.status(200).json(trees);
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
};

module.exports.createTreeOrUpdate = async (req, res) => {
  logger.debug(`received body:  ${JSON.stringify(req.body)}`);

  const { rootPath, filter, id } = req.body;

  await scanner
    .getFilesFromDirectory(rootPath, filter)
    .then((scan) => {
      DirectoryTree.findOneAndUpdate(
        { root: rootPath },
        {
          root: rootPath,
          filter: {
            extName: filter,
          },
          tree: scan,
        },
        { upsert: true, new: true },
        (err, doc) => {
          if (err) {
            res.status(400).send(err);
          }
          logger.debug(JSON.stringify(doc));
          res.status(200).json([doc]);
        }
      );
    })
    .catch((err) => {
      logger.error(err);
      res.status(400).send(err);
    });
};

module.exports.rebuildDatabase = async (req, res) => {
  const socket = req.app.get('socketio');

  const { files, id } = req.body;
  logger.debug(`received body:  ${JSON.stringify(req.body)}`);

  res.status(200).send('');

  socket.emit(id, `${getDateTime()} | database update for tree '${id}' was initiated`);

  const tree = await DirectoryTree.findById(id, 'inserted', { lean: true });
  var toHold = [];
  var toDelete = [];
  var toInserted = [];
  if (tree && tree.inserted) {
    const { inserted } = tree;

    toHold = inserted.filter((e) => {
      return files.indexOf(e) > -1;
    });

    toDelete = inserted.filter((e) => {
      return files.indexOf(e) === -1;
    });

    toInserted = files.filter((e) => {
      return inserted.indexOf(e) === -1;
    });

    socket.emit(id, `${getDateTime()} | ${toHold.length} videos already present`);
    logger.debug(`${toHold.length} videos already present`);

    DirectoryTree.updateOne({ _id: id }, { inserted: toHold }, (err) => {
      if (err) {
        logger.error(err);
        socket.emit(`${id}-exception`, { err: err });
      }
    });

    if (toDelete.length > 0) {
      logger.debug(`${toDelete.length} videos will be deleted`);
      socket.emit(id, `${getDateTime()} | ${toDelete.length} videos will be deleted`);

      await Video.deleteMany({ path: toDelete })
        .then(() => {
          logger.debug(`${toDelete.length} succesfully videos deleted`);
          socket.emit(id, `${getDateTime()} | ${toDelete.length} videos succesfully deleted`);
        })
        .catch((error) => {
          logger.error(error);
          socket.emit(`${id}-exception`, { err: err });
        });
    }
  } else {
    toInserted = files;
  }

  socket.emit(id, `${getDateTime()} | ${toInserted ? toInserted.length : 0} videos will be added to the database`);
  logger.debug(`${toInserted ? toInserted.length : 0} videos will be added to the database`);

  if (toInserted.length > 0) {
    socket.emit(`${id}-progress`, { total: toInserted.length, value: 0 });
    socket.emit(id, `${getDateTime()} | start metadata generation for ${toInserted.length} videos`);
    var storedVideos = 0;
    for (const file of toInserted) {
      socket.emit(id, `${getDateTime()} | now generate meta data for ${file}`);

      const metaData = await scanner
        .generateMovieMetaData(file, id)
        .catch((err) => {
          logger.error(err);
          socket.emit(`${id}-exception`, { err: err });
        });

      socket.emit(id, `${getDateTime()} | successfully generated meta data for '${file}'`);

      const newEntry = await createVideoEntry(metaData)
        .catch((err) => {
          logger.error(err);
          socket.emit(`${id}-exception`, { err: err });
        });

      await DirectoryTree.updateOne({ _id: id }, { $push: { inserted: newEntry.path } })
        .catch((err) => {
          logger.error(err);
          socket.emit(`${id}-exception`, { err: err });
        });

      socket.emit(id, `${getDateTime()} | '${file}' was stored`);
      socket.emit(`${id}-progress`, { total: toInserted.length, value: ++storedVideos });
    }
  }
  socket.emit(`${id}-finished`, `${getDateTime()} | updating database finished.`);
};

async function createVideoEntry(metaData) {
  return new Promise((resolve, reject) => {
    Video.create(metaData)
      .then((doc) => resolve(doc))
      .catch((err) => reject(err));
  });
}

module.exports.activateWatcher = async (req, res) => {
  const id = req.params.id;

  DirectoryTree.findById(id, (err, doc) => {
    if (err) {
      logger.error(err);
      res.status(400).json({ error: err });
    }

    // Observer
    //   .on("ready", () => {
    //     res.status(200).json({ activated: true })
    //   })
    //   .on('all', log => {
    //     logger.info(`Observer: event => ${log.event} : path => ${log.path}`)
    //   });

    watcher.add(doc.root);
    watcher
      .on('ready', (log) => {
        res.status(200).json({ activated: true });

        // Observer.add(doc.root);
        // Observer
        //   .on("ready", log => {
        //     logger.info("ready")
        //   })
        //   .on("add", () => {
        //     logger.info("new file")
        //   });
      })
      .on('add', (path) => logger.info(`File ${path} has been added`))
      .on('change', (path) => logger.info(`File ${path} has been changed`));
  });
};
