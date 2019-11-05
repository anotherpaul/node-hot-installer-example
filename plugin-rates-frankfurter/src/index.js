const request = require('request-promise');

async function execute({ from, to }) {
  try {
    const currencyInfo = await request({
      uri: 'https://frankfurter.app/latest',
      method: 'GET',
      json: true,
      qs: {
        from,
      },
    });
    const image = await request({ uri: 'https://random.dog/woof.json', method: 'GET', json: true });
    return {
      url: image.url,
      rate: currencyInfo.rates[to],
    };
  } catch (err) {
    return null;
  }
}

module.exports = {
  execute,
};
