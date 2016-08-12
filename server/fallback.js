'use strict';

const proxy = require('express-http-proxy');
const express = require('express');
const config = require('./config').get();

module.exports = app => {
  config.fallbacks.forEach(item => {
    if (item.target) {
      app.use(item.url, (req, res, next) => {
        proxy(item.target, {
          forwardPath: function(req) {
            return require('url').parse(req.url).path;
          },
          decorateRequest: function(req) {
            req.headers['X-Server-Proxy'] = 'Stubborn-server';
            return req;
          }
        })(req, res, next);
      });
    } else if (item.path) { // We assume the target is a local folder if not an url
      app.use(item.url.replace(/\*$/, ''), express.static(item.path));
    }
  });
};
