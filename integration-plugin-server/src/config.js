const { env } = process;

module.exports = {
  server: {
    hostname: env.SERVER_HOSTNAME || 'integration-plugin-server',
    port: parseInt(env.SERVER_PORT, 10) || 8000,
  },
  mongoConnectionString: env.MONGO_CONNECTION_STRING || 'mongodb://mongo:27017/test',
  redisConfig: JSON.parse(env.REDIS_CONFIG || '{ "port": 6379, "host": "redis" }'),
  newPluginChannel: env.NEW_PLUGIN_CHANNEL || 'new_plugin',
  filePath: env.PACKAGE_FILE_PATH || '/package-files',
};
