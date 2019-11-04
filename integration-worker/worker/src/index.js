const Redis = require('ioredis');
const express = require('express');
const bodyParser = require('body-parser');
const { celebrate, errors } = require('celebrate');
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

  server.post('/command', celebrate(validator.command), async (req, res) => {
    try {
      const results = await worker.execute({ data: req.body.data, plugin: req.body.plugin });
      res.status(200).json(results);
    } catch (err) {
      res.status(500).send(err);
    }
  });
  server.use(errors());
  server.listen(config.server.port, () => console.log(`worker listens on ${config.server.port}!`));
}

startServer();
