/* eslint global-require: "off", import/no-dynamic-require: "off" */

const config = require('./config');
const request = require('request-promise');

function createWorker({ redisClient }) {
  const plugins = {};

  function loadPackage({ name, path }) {
    delete require.cache[require.resolve(path)];
    plugins[name] = require(path);
  }

  async function init() {
    redisClient.on('message', (channel, message) => {
      if (channel === config.newInstalledPluginChannel) {
        try {
          console.log(`received ${message}`);
          const packageInfo = JSON.parse(message);
          loadPackage(packageInfo);
        } catch (err) {
          console.error(`error loading package ${err.message || err.toString()}`);
        }
      }
    });

    redisClient.subscribe(config.newInstalledPluginChannel);
    const packageList = await request({
      method: 'GET',
      uri: `${config.loaderUrl}/packages`,
      json: true,
    });
    console.log('received package list from package loader');
    packageList.forEach(loadPackage);
  }

  function getPlugin(plugin) {
    return plugins[plugin];
  }

  return {
    init,
    getPlugin,
  };
}

module.exports = createWorker;
