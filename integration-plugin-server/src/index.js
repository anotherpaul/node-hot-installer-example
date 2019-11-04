const express = require('express');
const multer = require('multer');
const { celebrate, errors } = require('celebrate');
const mongoose = require('mongoose');
const Redis = require('ioredis');

const config = require('./config');
const validators = require('./validator');
const createHandlers = require('./handlers');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.filePath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadMiddleware = multer({ storage }).single('plugin');

async function startApp() {
  const redisClient = new Redis(config.redisConfig);
  await mongoose.connect(config.mongoConnectionString, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  const handlers = createHandlers({ mongoose, redisClient });

  const server = express();
  server.use(express.static(config.filePath));

  server.get('/plugins', handlers.listPlugins);
  server.post('/plugins', uploadMiddleware, celebrate(validators.newPlugin), handlers.newPlugin);
  server.use(errors());

  server.listen(config.server.port, () => console.log(`integration-api listening on ${config.server.port}`));
}

startApp();
