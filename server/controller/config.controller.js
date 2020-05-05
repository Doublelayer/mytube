const Config = require('../model/config.model');

module.exports.listConfig = async (req, res) => {
  const config = await Config.find();

  res.json(config);
};

module.exports.createConfig = async (req, res) => {
  const config = new Config(req.body);
  await config.updateOne(req.body, { upsert: true });

  res.json(config);
};
