const config = require('./config');
const createPluginsStorage = require('./plugins');

function createHandlers({ mongoose, redisClient }) {
  const plugins = createPluginsStorage({ mongoose });
  async function newPlugin(req, res) {
    const packageUrl = `http://${config.server.hostname}:${config.server.port}/${req.file.filename}`;
    const pluginInfo = {
      packageUrl,
      name: req.body.name,
    };
    try {
      await plugins.create(pluginInfo);
      await redisClient.publish(config.newPluginChannel, JSON.stringify(pluginInfo));
    } catch (err) {
      return res.status(500).send(`error processing ${req.file.filename} upload: ${err.message}`);
    }
    return res.status(200).send(`uploaded ${req.file.filename} successfully, installation command sent to workers`);
  }

  async function listPlugins(req, res) {
    const results = await plugins.getAll();
    res.status(200).json(results);
  }

  return {
    newPlugin,
    listPlugins,
  };
}

module.exports = createHandlers;
