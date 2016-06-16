'use strict';

module.exports = (req, res, utils) => {

  global.console.log('here is an illegal log! Hard to find where that comes from right?');
  utils.log('so please use "utils.log()" to display messages');

  const db = utils.db(req);

  res.json({
    test: 'targeting',
    whatItRealyGet: __filename,
    db: db,
    type: 'this is a mock service'
  });
};
