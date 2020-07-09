const { createLogger, format, transports } = require('winston');
const winstonTimestampColorize = require('winston-timestamp-colorize');
const { combine, timestamp, label, printf } = format;
const config = require("../config")

require('winston-mongodb');
require('winston-daily-rotate-file');

const infoFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const errorFormat = printf(({ level, message, label, timestamp }) => {
  const msg = message.stack ? message.stack : message
  return `${timestamp} [${label}] ${level}: ${msg}`;
});

const combinedTransport = () => {
  return new (transports.DailyRotateFile)({
    infoFormat,
    filename: `${config.logs.combined}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: combine(
      format.splat(),
      label({ label: 'api-server' }),
      timestamp(),
      infoFormat,
    )
  })
}

const fileRotateTransport = (fileName, format) => {
  return new (transports.DailyRotateFile)({
    filename: fileName,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: format
  })
}

const consoleTransport = () => {
  return new transports.Console({
    colorize: true,
    format: combine(
      format.splat(),
      label({ label: 'api-server' }),
      timestamp(),
      winstonTimestampColorize(),
      format.colorize(),
      infoFormat,
    )
  })
}

const debug = createLogger({
  level: 'debug',
  transports: [
    consoleTransport(),
    combinedTransport(),
    fileRotateTransport(`${config.logs.debug}-%DATE%.log`, combine(
      format.splat(),
      label({ label: 'api-server' }),
      timestamp(),
      infoFormat,
    ))
  ]
});

const info = createLogger({
  level: 'info',
  transports: [
    consoleTransport(),
    combinedTransport(),
    fileRotateTransport(`${config.logs.info}-%DATE%.log`, combine(
      format.splat(),
      label({ label: 'api-server' }),
      timestamp(),
      infoFormat,
    ))
  ]
});

const warn = createLogger({
  level: 'warn',
  transports: [
    consoleTransport(),
    combinedTransport(),
    fileRotateTransport(`${config.logs.warn}-%DATE%.log`, combine(
      format.splat(),
      label({ label: 'api-server' }),
      timestamp(),
      infoFormat,
    ))
  ]
});

const error = createLogger({
  level: 'error',
  transports: [
    combinedTransport(),
    new transports.Console({
      colorize: true,
      format: combine(
        format.splat(),
        label({ label: 'api-server' }),
        timestamp(),
        winstonTimestampColorize(),
        format.colorize(),
        errorFormat,
      ),
    }),
    new transports.MongoDB({
      options: { useUnifiedTopology: true },
      db: config.logs.url,
      collection: "error_logs"
    })
  ]
});

if (config.environment === 'dev') {
  error.add(fileRotateTransport(`${config.logs.error}-%DATE%.log`, combine(
    format.splat(),
    label({ label: 'api-server' }),
    timestamp(),
    errorFormat,
  ))
  )
}

const enableLogger = () => {
  return config.environment !== 'prod' && config.environment !== 'test';
}

const logger = {
  debug: function (msg) {
    enableLogger() && debug.debug(msg);
  },
  info: function (msg) {
    enableLogger() && info.info(msg);
  },
  warn: function (msg) {
    warn.warn(msg);
  },
  error: function (msg) {
    config.environment !== 'test' && error.error(msg);
  },
};

module.exports = logger;