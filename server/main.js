'use strict';

const CleanRoutes = require('./clean-express-routes');
const Mocks = require('./mocks');
const Includes = require('./includes');
const Fallbacks = require('./fallback');

module.exports = stub => {
  const { app, config, log } = stub;

  CleanRoutes(stub);
  Includes(stub);
  Mocks(stub);
  Fallbacks(stub);

  app.process = app.listen(config.get().servePort, () => {
    let fallbacks = Object.keys(config.get().fallbacks);
    log.default('Mocks set for', fallbacks.join(', '));
    log.success(`Server is running at http://127.0.0.1:${config.get().servePort}`);
  });
};
