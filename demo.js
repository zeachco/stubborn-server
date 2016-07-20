const stubborn = require('./'); // stubborn-server

stubborn.start({
  verbose: true,
  namespace: '',
  fallbacks: [{
    url: '/css/',
    path: 'demo/static'
  }, {
    url: '/*',
    target: 'http://127.0.0.1:3000'
  }]
});

stubborn.set({
  verbose: true,
  namespace: 'senario-1',
  fallbacks: [{
    url: '/css/',
    path: 'demo/static'
  }, {
    url: '/*',
    target: 'http://127.0.0.1:3000'
  }]
});

stubborn.stop();
