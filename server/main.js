'use strict';

const app = require('./app');
const log = require('./logger');
const config = require('./config').get();

require('./mocks');
require('./fallback');
require('./dead-end');

module.exports = () => {
  app.process = app.listen(config.servePort, () => {
    let fallbacks = Object.keys(config.fallbacks);
    log.default('Mocks set for', fallbacks.join(', '));
    log.success(`Server is running at http://127.0.0.1:${config.servePort}`);
  });
};
