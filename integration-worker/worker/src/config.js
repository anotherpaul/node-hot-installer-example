const { env } = process;

module.exports = {
  server: {
    port: env.PACKAGE_LOADER_PORT || 9000,
  },
  redisConfig: JSON.parse(env.REDIS_CONFIG || '{ "port": 6379, "host": "redis" }'),
  newInstalledPluginChannel: env.NEW_INSTALLED_PLUGIN_CHANNEL || 'new_installed_plugin',
  loaderUrl: env.PACKAGE_LOADER_URL || 'http://localhost:9001',
};
