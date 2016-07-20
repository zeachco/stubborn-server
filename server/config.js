'use strict';
/**
 * Configuration to be used in the application
 * loaded in this order
 * 1. file
 * 2. configuration passed in the start() method
 * 3. configuration passed dynamically with the set() method
 */
const path = require('path');
const log = require('./logger');
let config;

try {
  config = require(path.join(process.cwd(), 'stubborn'));
} catch (e) {
  config = {};
}

module.exports = {
  set: (options) => {
    config = Object.assign(config, options || {});
    log.verbose(config.verbose);

    [
      'verbose = boolean',
      'namespace = string',
      'servePort = number',
      'fallbacks = object'
    ].forEach(check => {
      let s = check.split(/ ?= ?/);
      if (eval(`typeof config.${s[0]} !== '${s[1]}'`)) {
        log.error(`${s[0]} is supposed to be a ${s[1]}`);
      }
    });

    config.fallbacks.forEach(fallback => {
      if (!fallback.target && !fallback.path) {
        throw new Error({
          message: 'fallback must contain at least "path" or "target" values',
          data: fallback
        });
      }
    });

    log.debug('Server configuration', config);
  },
  get: () => config
};
