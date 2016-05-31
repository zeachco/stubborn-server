'use strict';

const chalk = require('chalk');

let verbose = false;

const wrap = (color, ...txts) => {
  let prefix = '';
  if (verbose) {
    let trace = new Error().stack;
    let context = trace.split(/at /g);
    trace = context[3].trim().split(' ')[1];
    trace = trace.replace(process.cwd() + '/', '');
    prefix = chalk.gray(trace);
  }
  txts = txts.map(t => typeof t === 'object' ? JSON.stringify(t, null, 2) : t).map(t => chalk[color].bold(t));
  global.console.log(prefix, ...txts);
};

module.exports = {
  verbose: bol => verbose = bol,
  default: (...txts) => wrap('white', ...txts),
  info: (...txts) => wrap('blue', ...txts),
  success: (...txts) => wrap('green', ...txts),
  error: (...txts) => wrap('red', ...txts),
  warn: (...txts) => wrap('yellow', ...txts),
  debug: (...txts) => {
    if (verbose) {
      wrap('gray', ...txts);
    }
  },
  mock: (...txts) => wrap('magenta', ...txts)

};
