const express = require('express');
const Redis = require('ioredis');
const createHotInstaller = require('hot-installer');

const config = require('./config');
const createHandlers = require('./handlers');

async function startServer() {
  const hotInstaller = await createHotInstaller({ installPath: config.installPath });
  const redisSubscribeClient = await new Redis(config.redisConfig);
  const redisPublishClient = await new Redis(config.redisConfig);

  const handlers = createHandlers({ redisClient: redisPublishClient, hotInstaller });

  try {
    await handlers.init();
  } catch (err) {
    console.error(`initialization failed: ${err}`);
    process.exit(1);
  }

  redisSubscribeClient.subscribe(config.newPluginChannel);
  redisSubscribeClient.on('message', (channel, message) => {
    if (channel === config.newPluginChannel) {
      try {
        console.log('received', message);
        const packageInfo = JSON.parse(message);
        handlers.updateInstallationQueue(packageInfo);
      } catch (err) {
        console.error(err);
      }
    }
  });

  const app = express();
  app.get('/packages', async (req, res) => {
    try {
      const results = await handlers.getPackageList();
      res.status(200).json(results);
    } catch (err) {
      res.status(500).send(err);
    }
  });
  app.listen(config.server.port, () => {
    console.log(`package-loader listens on ${config.server.port}!`);
    handlers.installFromQueue();
  });
}

startServer();
