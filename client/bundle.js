'use strict';

window.document.getElementById('app').innerHTML = '<h1>Stubborn</h1>';

var debug = function debug(title, data) {
  var h3 = document.createElement('h3');
  h3.innerHTML = title;
  var p = document.createElement('pre');
  p.innerHTML = JSON.stringify(data, null, 2).split(/\\n/g).map(function (l) {
    return l.trim();
  }).join('');
  document.body.appendChild(h3);
  document.body.appendChild(p);
};

var req1 = {
  method: 'get'
};
fetch('/api/path/to/service', req1).then(function (xhr) {
  xhr.json().then(function (data) {
    return debug(req1.method + ' ' + xhr.url, data);
  });
});

var req2 = {
  method: 'get'
};
fetch('/api/path/to/other/service').then(function (xhr) {
  xhr.json().then(function (data) {
    return debug(req2.method + ' ' + xhr.url, data);
  });
});

var req3 = {
  method: 'post',
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    this: 'is',
    the: 'payload',
    sent: 'with a POST'
  })
};

fetch('/api/path/to/service', req3).then(function (xhr) {
  xhr.json().then(function (data) {
    return debug(req3.method + ' ' + xhr.url, data);
  });
});

fetch('/api/path/to/non/existing/service', req3).then(function (xhr) {
  xhr.json().then(function (data) {
    return debug(req3.method + ' ' + xhr.url, data);
  });
});

fetch('/api/path/to/custom/service', req3).then(function (xhr) {
  xhr.json().then(function (data) {
    return debug(req3.method + ' ' + xhr.url, data);
  });
});

// client SDK
var Stubborn = window.Stubborn = {};

Stubborn.setup = function (config) {
  // mocks formating
  config.mocks = Object.keys(config.mocks).map(function (k) {
    var req = k.split(' ');
    return {
      path: req[1],
      method: req[0],
      fn: '\n' + config.mocks[k].toString()
    };
  });
  debug('Setup config look like this', config);
  // isomorphic call to /stubborn/setup/:namespace goes there
};

Stubborn.setup({
  namespace: 'usually put test unique name here',
  db: {
    count: 0,
    role: 'ADMIN',
    logged: true
  },
  mocks: {
    'POST /api/path/to/custom/service': function POSTApiPathToCustomService(req, res, utils) {
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

