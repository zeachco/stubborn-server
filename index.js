const methods = {
  log: require('./server/logger'),
  start: () => require('./server'),
  start: (config = {}) => {
    require('./server');
    config.mocks = Object.keys(config.mocks).map(k => {
      let req = k.split(' ');
      return {
        path: req[1],
        method: req[0],
        fn: '\n' + config.mocks[k].toString()
      };
    });
    // isomorphic call to /stubborn/setup/:namespace goes there
  },
  stop: () => {
    require('./server/app').process.close();
  }
};

module.exports = methods;
