const app = require('./app');
const db = require('./database');
const config = require('./config');
const logger = require("./utils/logger")

const startTime = new Date();

db.connect().then(() => {

  const server = app.listen(config.appPort, () => {
    /* eslint-disable no-console */
    logger.info(`server started and listening on port: '${server.address().port}'`);
    logger.info(`time needed for startup: ${new Date() - startTime}ms`)
    /* eslint-enable no-console */

    const socketIo = require('socket.io')(server);
    app.set('socketio', socketIo);
  })
}).catch(err => {
  logger.error(err)
});


