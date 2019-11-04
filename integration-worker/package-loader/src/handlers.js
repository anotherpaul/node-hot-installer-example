const request = require('request-promise');
const config = require('./config');

function createHandlers({ redisClient, hotInstaller }) {
  let installedPackages = {};
  let packagesQueue = [];

  async function updateInstallationQueue(packageInfo) {
    packagesQueue.push(packageInfo);
  }

  async function installFromQueue() {
    if (packagesQueue.length > 0) {
      const packagesToInstall = [...packagesQueue];
      packagesQueue = [];
      const packageUrlList = packagesToInstall.map(({ packageUrl }) => packageUrl);
      await hotInstaller.install(packageUrlList);
      console.log('installed', packageUrlList);

      await Promise.all(
        packagesToInstall.map(async ({ name }) => {
          const info = hotInstaller.info(name);
          const packageInstallInfo = {
            name,
            path: info.path,
          };
          await redisClient.publish(config.newInstalledPluginChannel, JSON.stringify(packageInstallInfo));
          console.log(`notified workers about ${name} in ${info.path}`);
          installedPackages[name] = info;
        }),
      );
    }

    setTimeout(installFromQueue, config.installInterval);
  }

  async function installMissingPackages(packages) {
    console.log('need to install', packages.length);
    const packageUrls = packages.map(({ packageUrl }) => packageUrl);
    console.log('installing', packageUrls);
    await hotInstaller.install(packageUrls);
    packages.forEach(({ name }) => {
      const info = hotInstaller.info(name);
      installedPackages[name] = info;
    });
    return console.log('installed everything');
  }

  async function updatePackageList() {
    console.log('getting package list from package server...');
    const serverPackages = await request({
      method: 'GET',
      uri: `http://${config.packageServer.host}:${config.packageServer.port}/packages`,
      json: true,
    });

    const missingPackages = serverPackages.filter(({ name }) => !installedPackages[name]);
    if (missingPackages.length > 0) {
      await installMissingPackages(missingPackages);
    }
    return installedPackages;
  }

  function getPackageList() {
    return installedPackages;
  }

  async function init() {
    installedPackages = await hotInstaller.init();
    await updatePackageList();
  }

  return {
    getPackageList,
    updateInstallationQueue,
    init,
    installFromQueue,
  };
}

module.exports = createHandlers;
