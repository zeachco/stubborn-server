'use strict';
const log = require('./logger');

module.exports = app => {
  app.use((req, res) => {
    log.error('cannot serve anything for ', req.method, req.url);
    res.status(404);
    res.end('No mock or fallback provided for ' + req.url);
  });
};
