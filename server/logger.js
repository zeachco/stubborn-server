'use strict';

var chalk = require('chalk');

const wrap = (color, txt) => {
  txt = typeof txt === 'object' ? JSON.stringify(txt, null, 2) : txt;
  return global.console.log(chalk[color].bold(txt));
};

module.exports = {
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
    wrap('gray', txt);
  }
};
