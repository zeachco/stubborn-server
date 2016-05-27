const Stubborn = require('stubborn-server');

Stubborn.start({
  namespace: 'usually put test unique name here',
  db: {
    count: 0,
    role: 'ADMIN',
    logged: true
  },
  mocks: {
    'POST /api/path/to/custom/service': (req, res, utils) => {
      let db = utils.db(req);
      utils.db.reset(req);
      db.count++;
      if (db.count > 4) {
        res.status = 200;
        res.json({
          count: db.count
        });
      }
    },
    // will resolve to api/path/to/other/service/get-bundle.[js|json]
    'GET /api/path/to/other/service': 'get-bundle'
  }
});

// Stubborn.stop();
