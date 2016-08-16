# Is your backend stubborn?
### node v4.2.2 + [![Build Status](https://travis-ci.org/zeachco/stubborn-server.png)](https://travis-ci.org/zeachco/stubborn-server) 

NodeJS Stub server for test and dev purposes

It allows:

- mocking with static json
- mocking with dynamic request handlers based on [Express requests](http://expressjs.com/en/4x/api.html#req)
- storing/accessing a memory database
- separate database per namespace
- reset a db at anytime with default values
- usage of aliases to get alternate mock responses (allow scenarios flexibility)
- integrates well with test framework

## how to use

create a `stubborn.js` file where you want to use it content might look like

```javascript
module.exports = {
  logMode: 'all', // can be 'all', 'info', 'mock', 'warn', 'error' or 'none'
  namespace: '', // help switching between different senarios
  pathToMocks: 'mock-examples', // mock folder relative path
  servePort: 8059,
  includes: ['__custom/express_handlers'], // List of files into the mock folder where the express app will be exposed for custom handling
  fallbacks: [
    { // using "path" key tells that we refer to a local file
      url: '/assets/*',
      path: '/path/to/static/folder'
    },
    { // using "target" key tells that we refer to an http location and is treated as a server proxy
      url: '/*':,
      target: 'localhost:3000'
    },
    { // using "mock" key tells that we refer to an existing mock, a direct regex can be used here
      url: /api\/path\/([^\/]+)/,
      mock: 'api/path/__wildcard__/more/paths'
    }
  ]
};
```

or a `stubborn.json` file

```json
{
  "logMode": "mock",
  "namespace": "",
  "pathToMocks": "mock-examples",
  "servePort": 8059,
  "includes": ["__custom/express_handlers"],
  "fallbacks": [
    {
      "url": "/assets/*",
      "path": "/path/to/static/folder"
    },
    {
      "url": "/*",
      "target": "localhost:3000"
    },
    {
      "url": "api\/path\/([^\/]+)",
      "target": "api/path/__wildcard__/more/paths"
    }
  ]
}
```

create some mocks like the one given in

<demo>
</demo>

this will have the following behaviour ![mock behaviour](https://raw.githubusercontent.com/zeachco/stubborn-server/master/demo/memory-database.gif)

then start server with something like this

```javascript
const stub = require('stubborn-server');

stub.start(/* config to extend ./stubborn.js if required */);

// from this point, you may run your queries

stub.config.set({
  namespace: 'alt'
});

// from this point, you may run other queries

stub.stop();
```
