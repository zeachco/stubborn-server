'use strict';

const log = require('./logger');
const config = require('./config').get();

const CleanRoutes = require('./clean-express-routes');
const Mocks = require('./mocks');
const Includes = require('./includes');
const Fallbacks = require('./fallback');
const Deadend = require('./dead-end');

module.exports = (app) => {
  CleanRoutes(app);
  Includes(app);
  Mocks(app);
  Fallbacks(app);
  app.process = app.listen(config.servePort, () => {
    let fallbacks = Object.keys(config.fallbacks);
    log.default('Mocks set for', fallbacks.join(', '));
    log.success(`Server is running at http://127.0.0.1:${config.servePort}`);
  });
};
