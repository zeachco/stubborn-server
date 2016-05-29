const Stubborn = require('./'); // stubborn-server

Stubborn.start();

Stubborn.setup({
  namespace: 'localhost',
  db: {
    count: 0,
    role: 'ADMIN',
    logged: true
  },
  mocks: {
    'POST /api/path/to/custom/service': (req, res, utils) => {
      let db = utils.db(req);
      db.count++;
      res.json({
        count: db.count
      });
      // if (db.count > 4) {
      //   utils.db.reset(req); // reset still buggy
      // }
    },
    // will resolve to api/path/to/other/service/get-alternate.[js|json]
    'GET /api/path/to/other/service': 'alternate'
  }
});

// Stubborn.stop();
