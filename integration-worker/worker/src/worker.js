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
      if (channel === config.redis.channels.update) {
        try {
          console.log(`received ${message}`);
          const packageInfo = JSON.parse(message);
          loadPackage(packageInfo);
        } catch (err) {
          console.error(`error loading package ${err.message || err.toString()}`);
        }
      }
    });

    redisClient.subscribe(config.redis.channels.update);
    const packageList = await request({
      method: 'GET',
      uri: `http://${config.loader.host}:${config.loader.port}/packages`,
      json: true,
    });
    console.log('received package list from package loader');
    packageList.forEach(loadPackage);
  }

  function execute({ data, plugin }) {
    const rejectFunction = () => Promise.reject(new Error(`plugin ${plugin} was not found`));
    const fn = plugins[plugin].execute || rejectFunction;
    return fn(data);
  }

  return {
    init,
    execute,
  };
}

module.exports = createWorker;
