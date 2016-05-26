window.document.getElementById('app').innerHTML = '<h1>Stubborn</h1>';

const debug = (title, data) => {
  let h3 = document.createElement('h3');
  h3.innerHTML = title;
  let p = document.createElement('pre');
  p.innerHTML = JSON.stringify(data, null, 2).split(/\\n/g).map(l => l.trim()).join('');
  document.body.appendChild(h3);
  document.body.appendChild(p);
};

const req1 = {
  method: 'get'
};
fetch('/api/path/to/service', req1).then(xhr => {
  xhr.json().then(data => debug(`${req1.method} ${xhr.url}`, data));
});

const req2 = {
  method: 'get'
};
fetch('/api/path/to/other/service').then(xhr => {
  xhr.json().then(data => debug(`${req2.method} ${xhr.url}`, data));
});

const req3 = {
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

fetch('/api/path/to/service', req3).then(xhr => {
  xhr.json().then(data => debug(`${req3.method} ${xhr.url}`, data));
});

fetch('/api/path/to/non/existing/service', req3).then(xhr => {
  xhr.json().then(data => debug(`${req3.method} ${xhr.url}`, data));
});

fetch('/api/path/to/custom/service', req3).then(xhr => {
  xhr.json().then(data => debug(`${req3.method} ${xhr.url}`, data));
});

// client SDK
const Stubborn = window.Stubborn = {};

Stubborn.setup = (config) => {
  // mocks formating
  config.mocks = Object.keys(config.mocks).map(k => {
    let req = k.split(' ');
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
    'POST /api/path/to/custom/service': (req, res, utils) => {
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
