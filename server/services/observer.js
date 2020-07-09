const chokidar = require('chokidar');
const EventEmitter = require('events').EventEmitter;
const logger = require('../utils/logger');

class Observer extends EventEmitter {
    constructor() {
        super();
    }

    add(folder) {
        logger.debug(folder)
        this.add(folder)
        this.emit('added', {
            message: folder
        });
    }

    watchFolder(folder) {
        try {
            logger.info(
                `[${new Date().toLocaleString()}] Watching for folder changes on: ${folder}`
            );

            chokidar.watch(folder)
                .on('ready', () => logger.info("watcher ready"))
                .on('all', (event, path) => {
                    logger.debug('all', {
                        path: path,
                        event: event
                    });
                });
        } catch (error) {
            logger.error(error);
        }
    }
}


class FileObserver {
    constructor() {
        if (!FileObserver.instance) {
            FileObserver.instance = new Observer();
        }
    }

    getInstance() {
        return FileObserver.instance;
    }

}

module.exports = FileObserver;