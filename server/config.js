/* eslint no-process-env: 0 */

require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'prod'
const port = isProduction ? process.env.PORT : 5005

const getConnectionString = () => {
  switch (process.env.NODE_ENV) {
    case "prod":
      return process.env.MONGODB_MYLOCALTUBE_PROD;
    case "dev":
      return process.env.MONGODB_MYLOCALTUBE_DEV;
    case "test":
      return process.env.MONGODB_MYLOCALTUBE_TEST;
    default:
      return ""
  }
}

module.exports = {
  isProduction: isProduction,
  isDev: process.env.NODE_ENV === 'dev',
  isTest: process.env.NODE_ENV === 'test',
  environment: process.env.NODE_ENV,
  appPort: port,
  dbUrl: getConnectionString(),
  logs: {
    url: process.env.MONGODB_URI_LOGS,
    debug: "./logs/debug",
    info: "./logs/info",
    warn: "./logs/warn",
    error: "./logs/error",
    combined: "./logs/combined"
  }
};
