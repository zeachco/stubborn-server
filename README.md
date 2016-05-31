# stubborn <img src="https://travis-ci.org/zeachco/zeachco.com.svg?branch=master" />
NodeJS Stub server for test and dev purposes

It allow :
- mocking with static json
- mocking with dynamic request handlers based on [Express  requests](http://expressjs.com/en/4x/api.html#req)
- storing/accessing a memory database
- separate database per namespace (can use a session)
- reset a db at anytime with default values
- usage of aliases to get alternate responses (allow scenarios flexibility)

### how to use

create a `stubborn.js` file where you want to use it
content might look like

```javascript
module.exports = {
  verbose: true,
  pathToMocks: 'mock-examples', // mock folder relative path
  serverPort: 8059,
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
  "pathToMocks": "mock-examples",
  "serverPort": 8059,
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
const Stubborn = require('stubborn-server');

Stubborn.start(/* config to extend ./stubborn.js if required */);

// from this point, you may run your queries

// Stubborn.stop();

```
