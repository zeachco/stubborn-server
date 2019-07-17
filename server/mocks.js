'use strict';

const pathResolver = require('./path-resolver');
const { wrapForceRequire } = require('./force-require');

module.exports = stub => {
  const { app, log } = stub;

  const MockBehaviours = {
    'function': (mocker, req, res) => wrapForceRequire(() => mocker(req, res, stub, mocker)),
    'object': (data, req, res) => res.json(data),
    'null': (data, req, res) => res.end()
  };
  app.use((req, res, next) => {
    let mocker = null;
    try {
      mocker = pathResolver(req, stub);
      try {
        MockBehaviours[typeof mocker](mocker, req, res);
        log.mock(`${req.method} ${req.url}`);
      } catch (e) {
        log.error({
          url: req.url,
          method: req.method,
          error: e
        });
      }
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        log.debug(`Fallback for ${req.method.toUpperCase()} ${req.url}`);
      } else {
        log.error({
          url: req.url,
          method: req.method,
          error: e
        });
      }
      next();
    }
  });
};
