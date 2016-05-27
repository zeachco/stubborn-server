'use strict';

const proxy = require('express-http-proxy');
const config = require('./config');
const app = require('./app');

app.use((req, res, next) => {
  let target = (config.fallback.host || req.hostname) + ':' + config.fallback.port;
  proxy(target, {
    filter: req => req.method == 'GET',
    forwardPath: req => require('url').parse(req.url).path
  })(req, res, next);
});
