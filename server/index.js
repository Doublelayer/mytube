const winston = require('winston');
const app = require('./app');
const db = require('./database');
const { APP_PORT } = require('./config');

db.connect(() => {
  const server = app.listen(APP_PORT, () => {
    /* eslint-disable no-console */
    winston.info('Listening on port ' + server.address().port);
    /* eslint-enable no-console */
  });
});
