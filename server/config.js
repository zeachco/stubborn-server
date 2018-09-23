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

const getInitialConfig = opts => {
  let baseConfig;
  try {
    baseConfig = require(path.join(process.cwd(), 'stubborn'));
  } catch (e) {
    baseConfig = {};
  }
  return Object.assign({}, baseConfig, opts || {});
};

const validateConfig = conf => {
  [
    'logMode = string',
    'namespace = string',
    'servePort = number',
    'fallbacks = object'
  ].forEach(check => {
    const [key, type] = check.split(/ ?= ?/);
    if (typeof conf[key] !== type) {
      log.error(`${key} is supposed to be a ${type}`);
    }
  });
};

const validateFallbacks = conf => {
  (conf.fallbacks || []).forEach(fallback => {
    if (!fallback.target && !fallback.path && !fallback.mock) {
      throw new Error({
        message: 'fallback must contain at least "path", "mock" or "target" keys',
        data: fallback
      });
    } else if (fallback.mock && fallback.url.constructor.name === 'String') {
      fallback.url = new RegExp(fallback.url);
    }
  });
};

const validateIncludesAndPlugins = conf => {
  conf.includes = conf.includes || [];
  conf.plugins = conf.plugins || [];
};

module.exports = function config() {
  return {
    config: {},
    set(options) {
      const conf = getInitialConfig(options);

      log.setMode(conf.logMode);

      validateConfig(conf);
      validateFallbacks(conf);
      validateIncludesAndPlugins(conf);

      log.debug('Server configuration', conf);

      this.config = conf;
    },
    get() {
      return this.config;
    },
    unset: function unset(keys) {
      [].concat(keys).forEach(key => { delete this.config[key]; });
    }
  };
};
