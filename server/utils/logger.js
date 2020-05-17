const winston = require('winston');

const format = winston.format.printf((info) => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

module.exports.logger = winston.createLogger({
  level: 'info',
  format: winston.format.timestamp(),
  transports: [
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({ format: winston.format.combine(winston.format.timestamp(), format), level: 'debug' }),
  ],
});
