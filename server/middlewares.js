const { isProduction } = require('./config');
const logger = require("./utils/logger")

function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  /* eslint-enable no-unused-vars */
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);

  var logmsg = {
    'ip': req.ip,
    'method': req.method,
    'url': req.originalUrl,
    'statusCode': res.statusCode,
    'body': req.body,
    'headers': req.headers,
    'time': new Date(),
    'errorMessage': err.message,
    'stack': err.stack
  };

  logger.error(logmsg);

  res.json({
    message: err.message,
    stack: isProduction ? '🥞' : err.stack,
  });
}

module.exports = {
  notFound,
  errorHandler
};
