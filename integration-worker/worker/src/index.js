const Redis = require('ioredis');
const express = require('express');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const config = require('./config');
const createWorker = require('./worker');
const validator = require('./validator');

async function startServer() {
  const redisClient = new Redis(config.redisConfig);
  const worker = await createWorker({ redisClient });
  try {
    await worker.init();
  } catch (err) {
    console.error(`error during init: ${err.message || err.toString()}`);
    process.exit(1);
  }
  const server = express();
  server.use(bodyParser.json());

  server.post('/command', validator.command, async (req, res) => {
    try {
      const plugin = worker.getPlugin(req.body.plugin);
      if (!plugin) {
        return res.status(404).send(`plugin ${plugin} was not found`);
      }
      const results = await plugin.execute(req.body.data);
      return res.status(200).json(results);
    } catch (err) {
      return res.status(500).send(err);
    }
  });

  server.use(errors());
  server.listen(config.server.port, () => console.log(`worker listens on ${config.server.port}!`));
}

startServer();
