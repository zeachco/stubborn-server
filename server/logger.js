'use strict';

var chalk = require('chalk');

const Modes = {
  ALL: ['debug', 'info', 'mock', 'warn', 'error'],
  INFO: ['info', 'mock', 'warn', 'error'],
  MOCK: ['mock', 'warn', 'error'],
  WARN: ['warn', 'error'],
  ERR: ['error'],
  NONE: []
}

let currentMode = Modes.ALL;

var wrap = (level, color, args) => {
  if (currentMode.indexOf(level) === -1) {
    return;
  }
  args = Array.prototype.slice.apply(args);
  var prefix = '';
  try {
    var trace = new Error();
    trace = trace
      .stack
      .split(/at /g)[3]
      .trim()
      .split(' ')[1]
      .replace(process.cwd() + '/', '');
    prefix = chalk.gray(trace);
  } catch (e) {
    prefix = ' > ';
  }
  args = args.map(t => typeof t === 'object' ? JSON.stringify(t, null, 2) : t).map(t => chalk[color].bold(t));
  args.splice(0, 0, prefix);
  global.console.log.apply(global.console, args);
};

module.exports = {
  mode: Modes,
  setMode: mode => typeof mode === 'string' ? currentMode = Modes[mode.toUpperCase()] : mode,
  verbose: bol => {
    wrap('warn', 'yellow', [`logger.verbose is deprecated, please use logger.setMode(logger.modes.${bol?'ALL' : 'INFO'})`]);
    currentMode = Modes[bol ? 'ALL' : 'INFO'];
  },
  debug: function() {
    wrap('debug', 'gray', arguments);
  },
  default: function() {
    wrap('info', 'white', arguments);
  },
  info: function() {
    wrap('info', 'blue', arguments);
  },
  success: function() {
    wrap('info', 'green', arguments);
  },
  mock: function() {
    wrap('mock', 'magenta', arguments);
  },
  warn: function() {
    wrap('warn', 'yellow', arguments);
  },
  error: function() {
    wrap('error', 'red', arguments);
  }

};
