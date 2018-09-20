'use strict';
const Conf = require('./config');
const path = require('path');

module.exports = app => {
  const conf = Conf.get();
  conf.includes.forEach(include => {
    // const file = path.join(conf.pathToMocks, include);

    const pathToMocks = conf.pathToMocks[0] === '/' ?
      conf.pathToMocks :
      path.join(process.cwd(), conf.pathToMocks);

    let file = path.join(
      pathToMocks,
      include
    );
    require(file)(app, require('..'));
  });
};
