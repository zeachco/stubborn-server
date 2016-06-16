# Is your backend stubborn? [![Build Status](https://travis-ci.org/zeachco/stubborn-server.png)](https://travis-ci.org/zeachco/stubborn-server)
NodeJS Stub server for test and dev purposes

It allows:
- mocking with static json
- mocking with dynamic request handlers based on [Express  requests](http://expressjs.com/en/4x/api.html#req)
- storing/accessing a memory database
- separate database per namespace
- reset a db at anytime with default values
- usage of aliases to get alternate mock responses (allow scenarios flexibility)
- integrates well with test framework

### how to use

create a `stubborn.js` file where you want to use it
content might look like

```javascript
module.exports = {
  verbose: true,
  namespace: '', // help switching between different senarios
  pathToMocks: 'mock-examples', // mock folder relative path
  servePort: 8059,
  fallbacks: {
    '/assets/*': '/path/to/static/folder',
    '/*': 'localhost:3000'
  }
};
```
or a `stubborn.json` file

```json
{
  "verbose": true,
  "namespace": "",
  "pathToMocks": "mock-examples",
  "servePort": 8059,
  "fallbacks": {
    "/assets/*": "/path/to/static/folder",
    "/*": "localhost:3000"
  }
}
```

create some mocks like the one given in [demo](demo)

this will have the following behaviour
![mock behaviour](https://raw.githubusercontent.com/zeachco/stubborn-server/master/demo/memory-database.gif)

then start server with something like this

```javascript
const stub = require('stubborn-server');

stub.start(/* config to extend ./stubborn.js if required */);

// from this point, you may run your queries

// stub.stop();

```
