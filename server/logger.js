'use strict';

var chalk = require('chalk');

var verbose = false;

var wrap = (color, args) => {
  args = Array.prototype.slice.apply(args);
  var prefix = '';
  if (verbose) {
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
  }
  args = args.map(t => typeof t === 'object' ? JSON.stringify(t, null, 2) : t).map(t => chalk[color].bold(t));
  args.splice(0, 0, prefix);
  global.console.log.apply(global.console, args);
};

module.exports = {
  verbose: bol => verbose = bol,
  default: function() {
    wrap('white', arguments);
  },
  info: function() {
    wrap('blue', arguments);
  },
  success: function() {
    wrap('green', arguments);
  },
  error: function() {
    wrap('red', arguments);
  },
  warn: function() {
    wrap('yellow', arguments);
  },
  debug: function() {
    if (verbose) {
      wrap('gray', arguments);
    }
  },
  mock: function() {
    wrap('magenta', arguments);
  }

};
