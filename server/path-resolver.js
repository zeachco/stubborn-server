'use strict';

const log = require('./logger');
const path = require('path');
const { wrapForceRequire } = require('./force-require');

module.exports = function pathResolver(req, stub) {
  const { config } = stub;
  let conf = config.get();
  let mock = null;

  // If absolute path, leave as is, otherwise, use current process path
  const pathToMocks = conf.pathToMocks[0] === '/' ?
    conf.pathToMocks :
    path.join(process.cwd(), conf.pathToMocks);

  const pluginResolved = conf.plugins
    .filter(plugin => Object.prototype.hasOwnProperty.call(plugin, 'loader'))
    .map(plugin => plugin.loader)
    .reduce((res, loader) => {
      if (res) return res;

      try {
        const customLoadedFile = loader(req, Object.assign({}, stub, {
          pathToMocks: pathToMocks
        }));

        return customLoadedFile;
      } catch (e) {
        log.debug('Failed to load custom loader file');
      }
    }, undefined);

  if (pluginResolved) {
    return pluginResolved;
  }

  let file = path.join(
    pathToMocks,
    req.url.split('?')[0],
    req.method.toLowerCase() + (conf.namespace ? '-' + conf.namespace : '')
  );

  wrapForceRequire(() => {
    try {
      mock = require(file);
    } catch (e) {
      const firstMatching = conf.fallbacks.filter(f => !!f.mock && f.url.test(req.url))[0];
      if (firstMatching) {
        file = path.join(
          pathToMocks,
          firstMatching.mock,
          req.method.toLowerCase() + (conf.namespace ? '-' + conf.namespace : '')
        );
        mock = require(file);
        mock.matches = firstMatching.url.exec(req.url);
      } else {
        throw 'no';
      }
    }
  });

  return mock;
};
