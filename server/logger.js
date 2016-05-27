'use strict';

const chalk = require('chalk');

let verbose = false;

const wrap = (color, txt) => {
  let prefix = '';
  if (verbose) {
    let trace = new Error().stack;
    let context = trace.split(/at /g);
    trace = context[3].trim().split(' ')[1];
    trace = trace.replace(process.cwd() + '/', '');
    prefix = chalk.gray(trace);
  }
  txt = typeof txt === 'object' ? JSON.stringify(txt, null, 2) : txt;
  global.console.log(prefix, chalk[color].bold(txt));
};

module.exports = {
  verbose: bol => verbose = bol,
  default: txt => wrap('white', txt),
  info: txt => wrap('blue', txt),
  success: txt => wrap('green', txt),
  error: txt => wrap('red', txt),
  warn: txt => wrap('yellow', txt),
  debug: txt => {
    if (verbose) {
      wrap('gray', txt);
    }
  },
  mock: txt => wrap('magenta', txt)

};
