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
      req.count++;
      utils.db.count++;
      if (req.count > 4) {
        res.status = 404;
        res.end(req.hostname);
      }
    },
    // will resolve to api/path/to/other/service/get-bundle.[js|json]
    'GET /api/path/to/other/service': 'get-bundle'
  }
});

// setTimeout(() => {
//   Stubborn.stop();
// }, 15000);
