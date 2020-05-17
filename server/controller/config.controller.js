const Config = require('../model/config.model');
const { logger } = require('../utils/logger');

module.exports.listConfig = async (req, res) => {
  const config = await Config.find();

  res.json(config);
};

module.exports.createConfig = async (req, res) => {
  logger.debug(`received body: ` + JSON.stringify(req.body));
  const config = new Config(req.body);
  await config.updateOne(req.body, { upsert: true }, (err, doc) => {
    res.status(200).json({
      success: err === null,
      config: config,
    });
  });
};
