'use strict';

const app = require('./app');
const log = require('./logger');
const config = require('./config');

require('./mocks');
require('./fallback');

app.process = app.listen(config.server.port, () => {
  log.default(`Mock folder is ${config.mocks}`);
  log.default(`Fallback is ${config.fallback.host}:${config.fallback.port}`);
  log.success(`Server is running at http://127.0.0.1:${config.server.port}`);
});
