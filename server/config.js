/* eslint no-process-env: 0 */

require('dotenv').config();

const isProduction = process.env === 'production';

module.exports = {
  MONGODB_URI: isProduction ? process.env.MONGODB_URI_PROD : process.env.MONGODB_URI_DEV,
  IS_PRODUCTION: isProduction,
  APP_PORT: process.env.PORT || 5000,
};
