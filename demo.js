const stubborn = require('./'); // stubborn-server

stubborn.start({
  verbose: true,
  namespace: '',
  fallbacks: {
    '/*': 'http://127.0.0.1:3000',
    '/css/*': 'demo/static',
    '/js/*': 'demo/static/app',
    '/assets/*': 'demo/static/images'
  }
});

stubborn.set({
  verbose: true,
  namespace: 'senario-1',
  fallbacks: {
    '/*': 'http://127.0.0.1:3000',
    '/css/*': 'demo/static',
    '/js/*': 'demo/static/app',
    '/assets/*': 'demo/static/images'
  }
});

stubborn.stop();
