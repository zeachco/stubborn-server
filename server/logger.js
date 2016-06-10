'use strict';

var chalk = require('chalk');

var verbose = false;

var wrap = (color, args) => {
  args = Array.prototype.slice.apply([], args);
  var prefix = '';
  if (verbose) {
    var trace = new Error().stack;
    var context = trace.split(/at /g);
    trace = context[3].trim().split(' ')[1];
    trace = trace.replace(process.cwd() + '/', '');
    prefix = chalk.gray(trace);
  }
  args = args.map(t => typeof t === 'object' ? JSON.stringify(t, null, 2) : t).map(t => chalk[color].bold(t));
  args.splice(0, 0, prefix);
  global.console.log.apply(this, args);
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
