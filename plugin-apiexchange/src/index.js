const request = require('request-promise');

async function execute({ from, to }) {
  try {
    const currencyInfo = await request({
      uri: `https://api.exchangerate-api.com/v4/latest/${from}`,
      method: 'GET',
      json: true,
    });
    const image = await request({ uri: 'https://aws.random.cat/meow', method: 'GET', json: true });
    return {
      url: image.file,
      rate: currencyInfo.rates[to],
    };
  } catch (err) {
    return null;
  }
}

module.exports = {
  execute,
};
