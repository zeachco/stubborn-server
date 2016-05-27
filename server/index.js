'use strict';

const app = require('./app');
const log = require('./logger');
const config = require('./config');
const proxy = require('express-http-proxy');

require('./bridge')(app);
require('./mocks')(app);

app.use((req, res, next) => {
  let target = (config.fallback.host || req.hostname) + ':' + config.fallback.port;
  proxy(target, {
    filter: req => req.method == 'GET',
    forwardPath: req => require('url').parse(req.url).path
  })(req, res, next);
});

app.process = app.listen(config.server.port, () => {
  log.default(`Mock folder is ${config.mocks}`);
  log.default(`Fallback is ${config.fallback.host}:${config.fallback.port}`);
  log.success(`Server is running at http://127.0.0.1:${config.server.port}`);
});
