'use strict';

const proxy = require('express-http-proxy');
const express = require('express');
const app = require('./app');
const config = require('./config').get();

Object.keys(config.fallbacks).forEach(key => {
  let target = config.fallbacks[key];
  if (target.indexOf(':') > -1) {
    app.use(key, (req, res, next) => {
      proxy(target, {
        forwardPath: function(req) {
          return require('url').parse(req.url).path;
        },
        decorateRequest: function(req) {
          req.headers['X-Server-Proxy'] = 'Stubborn-server';
          return req;
        }
      })(req, res, next);
    });
  } else { // We assume the target is a local folder if not an url
    app.use(key.replace(/\*$/, ''), express.static(target));
  }
});
