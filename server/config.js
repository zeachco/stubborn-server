'use strict';

const path = require('path');
const log = require('./logger');
let config = require(path.join(process.cwd(), 'stubborn'));

module.exports = options => {
  config = Object.assign(config, options || {});

  log.verbose(config.verbose);

  [ // check mandatory configuration
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

  if (options)
    log.debug('Server configuration', config);

  return config;
};
