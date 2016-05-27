# stubborn
NodeJS Stub server for test and dev purposes

It allow :
- mocking with static json
- mocking with dynamic request handlers based on [Express  requests](http://expressjs.com/en/4x/api.html#req)
- storing/accessing a memory database
- separate database per namespace (can use a session)
- reset a db at anytime with default values
- usage of aliases to get alternate responses (allow scenarios flexibility)

### how to use

create a `.stubbornrc.js` file where you want to use it
content might look like

```javascript
module.exports = {
  verbose: true,
  pathToMocks: 'mock-examples', // mock folder relative path
  server: {
    port: 8059
  },
  fallback: {
    host: 'hostname', // defaulted to 127.0.0.1's hostname value
    port: 8080
  }
};
```
or a `.stubbornrc.json` file

```json
{
  "verbose": true,
  "pathToMocks": "mock-examples",
  "server": {
    "port": 8059
  },
  "fallback": {
    "port": 8080
  }
};
```

create some mocks like the one given in [demo/mock-examples](demo/mock-examples)

here is a "complex" example

```javascript
// file: demo/mock-examples/api/path/to/service/delete.js

module.exports = (req, res, utils) => {
  let db = utils.db(req);
  if (!isFinite(db.count)) {
    db.count = 10;
  }
  if (db.count > 0) {
    utils.log(`count = ${db.count}... OK`);
    db.count--;
    res.status(204);
    res.end();
  } else {
    utils.log(`Failed call ! count = ${utils.db.count}`);
    res.status(401);
    res.json({
      error: 'You can\'t delete that item',
      canadianErrorPrefix: 'Very sorry! '
    });
  }
};
```

this will have the following behaviour
![mock behaviour](https://raw.githubusercontent.com/zeachco/stubborn-server/master/demo/memory-database.gif)

then start server with something like this

```javascript
const Stubborn = require('stubborn-server');

Stubborn.start();

// from this point, you may run your queries

// Stubborn.stop();

```

### Advanced configration

this part is planned but not yet available.
it should allow advance setup to dynamically mock requests

```javascript
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
    // will resolve to api/path/to/other/service/get-alternate.[js|json]
    'GET /api/path/to/other/service': 'get-alternate'
  }
});

Stubborn.stop();
```
