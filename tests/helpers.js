const getPort = require('get-port');

function getTestConf () {
  return getPort()
    .then(servePort => ({
      servePort,
      logMode: 'none',
      namespace: '',
      pathToMocks: 'demo/dynamic-mocks-examples',
      fallbacks: [{
        url: '/home/*',
        path: 'demo/static/'
      }]
    }));
}

module.exports = {
  getTestConf
};
