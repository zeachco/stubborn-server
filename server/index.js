'use strict';

const app = require('./app');
const log = require('./logger');

module.exports = options => {
  const config = require('./config')(options);

  require('./mocks')(config);
  require('./fallback')(config);
  require('./dead-end');

  app.process = app.listen(config.servePort, () => {
    let fallbacks = Object.keys(config.fallbacks);
    log.default('Mocks set for', fallbacks.join(', '));
    log.success(`Server is running at http://127.0.0.1:${config.servePort}`);
  });
};

