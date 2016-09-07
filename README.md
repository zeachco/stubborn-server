# Is your backend stubborn?

## Supports v4.x.x to latest [![Build Status](https://travis-ci.org/zeachco/stubborn-server.png)](https://travis-ci.org/zeachco/stubborn-server)

NodeJS Stub server for test and dev purposes

It allows:

- mocking with static json
- mocking with dynamic request handlers based on [Express requests](http://expressjs.com/en/4x/api.html#req)
- storing/accessing a memory database
- separate database per namespace
- reset a db at anytime with default values
- usage of aliases to get alternate mock responses (allow scenarios flexibility)
- integrates well with test framework

## Just show me code!

Ok... create a `stubborn.js` file where you want to use it content might look like

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

Then write your initiator like the one given in `demo.js` or in `tests/...`

Might look like this :

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

I also have the intention of having this available directly from the command line.

## Write your mocks

Ok there is two ways of doing this, depending on the size of your project you might want to choose the "include way" for large projects if you don't want to sacrifice flexibility and have a direct access to the `express` engine behind

or you may just use the "configuration driven" approach which requires less server architecture and rely on file system structure matching the api.

#### The include way...

basically you add `includes: ['path/to/handler']` to your configuration in order to use that handler.
This is also a good way of using node's `require` to better organise your files or to fit your project structure better.

Handler example:

```javascript
module.exports = (app, stub) => {
  app.get('/custom/express/path', myHandler);
  var stubbornConfig = stub.config.get();
  // ...
};
```

#### The configuration driven way...

By default the application will look into the folder containing mocks and set by the `pathToMocks` variable from the configuration.

the file name serving as a mock must match the request path plus the request method

example of requesting `POST http://localhost:3000/api/service`: will try to find `.../path/to/mocks/api/service/post.js` (or `.../service/post.json` or even `.../service/post/index.js` etc.)

Basicaly, it's a `require.resolve` that finds the files here.

example of a basic configuration driven mock

```javascript
// this function is the handler being called
module.exports = (req, res, utils) => {
  // req / res are from express
  console.log(req.method); // POST
  var stubbornCurrentConfig = utils.config.get();
  res.json(stubbornCurrentConfig);
  // ...
};
```
