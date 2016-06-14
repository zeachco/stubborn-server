const Stubborn = require('./')(); // stubborn-server

Stubborn.start({
  verbose: true,
  namespace: '',
  fallbacks: {
    '/*': 'http://127.0.0.1:3000',
    '/css/*': 'demo/static',
    '/js/*': 'demo/static/app',
    '/assets/*': 'demo/static/images'
  }
});

// Stubborn.stop();
