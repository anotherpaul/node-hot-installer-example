const { env } = process;

module.exports = {
  server: {
    port: env.PACKAGE_LOADER_PORT || 9001,
  },
  redisConfig: JSON.parse(env.REDIS_CONFIG || '{ "port": 6379, "host": "redis" }'),
  newPluginChannel: env.NEW_PLUGIN_CHANNEL || 'new_plugin',
  newInstalledPluginChannel: env.NEW_INSTALLED_PLUGIN_CHANNEL || 'new_installed_plugin',
  installPath: env.PACKAGE_INSTALL_PATH || '/packages',
  installInterval: parseInt(env.INSTALL_INTERVAL || '1000', 10),
};
