'use strict';

const app = require('./app');
const log = require('./logger');
const conf = require('./config')();

require('./mocks');
require('./fallback');
require('./dead-end');

app.process = app.listen(conf.servePort, () => {
  let fallbacks = Object.keys(conf.fallbacks);
  log.default('Mocks set for', ...fallbacks);
  log.success(`Server is running at http://127.0.0.1:${conf.servePort}`);
});
