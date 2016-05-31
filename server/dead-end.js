'use strict';
const log = require('./logger');
const app = require('./app');

app.use((req, res) => {
  log.error('cannot serve anything for ', req.method, req.url);
  res.status(404);
  res.end('No mock or fallback provided for ' + req.url);
});
