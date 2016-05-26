'use strict';

const chalk = require('chalk');

const wrap = (color, txt) => {
  let trace = new Error().stack;
  let context = trace.split(/at /g);
  trace = context[3].trim().split(' ')[1];
  trace = trace.replace(process.cwd() + '/', '');
  txt = typeof txt === 'object' ? JSON.stringify(txt, null, 2) : txt;
  return global.console.log(chalk.gray(trace), chalk[color].bold(txt));
};

let verbose = false;

module.exports = {
  verbose: bol => {
    verbose = bol;
  },
  default: txt => {
    wrap('white', txt);
  },
  info: txt => {
    wrap('blue', txt);
  },
  success: txt => {
    wrap('green', txt);
  },
  error: txt => {
    wrap('red', txt);
  },
  warn: txt => {
    wrap('yellow', txt);
  },
  debug: txt => {
    if (verbose) {
      wrap('gray', txt);
    }
  },
  mock: txt => {
    wrap('magenta', txt);
  }
};
