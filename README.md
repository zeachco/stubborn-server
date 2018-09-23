# stubborn-server

[![Greenkeeper badge](https://badges.greenkeeper.io/zeachco/stubborn-server.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/zeachco/stubborn-server.svg)](https://travis-ci.org/zeachco/stubborn-server)
[![License](https://img.shields.io/badge/license-GPL%203.0-blue.svg?style=flat)](https://raw.githubusercontent.com/zeachco/stubborn-server/master/LICENSE)

NodeJS Stub server for test and dev purposes

> Is your backend stubborn?

## Features

- Mocking with static json
- Mocking with dynamic request handlers based on [Express requests](http://expressjs.com/en/4x/api.html#req)
- Storing/accessing a memory database
- Separate database per namespace
- Reset a db at anytime with default values
- Usage of aliases to get alternate mock responses (allow scenarios flexibility)
- Integrates well with any test framework

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

Mocks can be specified in three ways:

1. Attaching express handlers
2. Including express handlers
3. Configuration-driven

The way you choose depends on the needs of your project. You may also
mix and match as the options are not exclusive.

### Attaching express handlers

When creating your mock server, a reference to the underlying raw express app
is available. You can attach any response handlers you want:

```javascript
const stub = require('stubborn-server');

// Attaching express handlers directly via `app` raw reference.
stub.app.use('/my/url/path', (req, res) => {
  // req / res are from express
  console.log(req.method);
  const response = {'hello': 'world'};
  // stub is stubborn server object
  console.log(stub.config.get());
  res.json(response);
});

stub.start();
// from this point, you may run your queries
stub.stop();
```

### Including express handlers

Instead of manually attaching handlers to the app, you may specify paths to
express handlers. The handlers will then be `require()`ed for you.

This example is functionally equivalent to the example above:

`main.js`:

```javascript
const stub = require('stubborn-server');

stub.config.set({
  includes: ['path/to/handler.js'],
});

stub.start();
// from this point, you may run your queries
stub.stop();
```

`handler.js`:

```javascript
module.exports = (app, stub) => {
  app.use('/my/url/path', (req, res) => {
    // req / res are from express
    console.log(req.method);
    const response = {'hello': 'world'};
    // stub is stubborn server object
    console.log(stub.config.get());
    res.json(response);
  });
};
```

### Configuration-driven

By default, when the server recieves a request it will look into the directory
specified by the `pathToMocks` configuration option for a mock response.

**The file name serving as a mock must match the request path plus the request
method.**

For example, a `POST` request to `http://localhost:3000/api/service` will try
to find files at the following locations:

 * `/path/to/mocks/api/service/post.js`
 * `/path/to/mocks/api/service/post.json`
 * `/path/to/mocks/api/service/post/index.js`
 * `/path/to/mocks/api/service/post/index.json`


Basically, it's a `require.resolve` that finds the proper mock response files.

The following is an example of a basic configuration driven `post.js` mock:

```javascript
// this function is the handler being called
module.exports = (req, res, stub) => {
  // req / res are from express
  console.log(req.method); // POST
  // stub is stubborn server object
  console.log(stub.config.get());
  res.json({ 'hello': 'world' });
};
```

and a `post.json` mock that returns the same mock response data:

```javascript
{
  "hello": "world"
}
```

## Plugins

A plugin architecture allows you to extend even more the custom functionality of your server.

### Custom loaders

Add your own custom loader that takes precedence over the default behavior of file system lookup and the `fallbacks` property - this way even if your loader throws you can still rely on the standard functionality.

Here is an example of a custom loader that uses sent data in order to load a mock:

```js
stub.start({
  plugins: [
    {
      loader: (req, { pathToMocks }) => {
        return require(path.join(pathToMocks, req.body.data);
      }
    }
  ]
});
```

> NOTE: you may also define multiple loaders, allowing you to have multiple custom fallbacks systems.

## License

[GPL-3.0](LICENSE) © 2018 Olivier Rousseau-Guyot
