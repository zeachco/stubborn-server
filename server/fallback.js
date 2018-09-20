'use strict';

const proxy = require('express-http-proxy');
const express = require('express');
const config = require('./config').get();

module.exports = app => {
  config.fallbacks.forEach(item => {
    if (item.target) {
      app.use(item.url, proxy(item.target, {
        proxyReqPathResolver: function(req) {
          return require('url').parse(req.url).path;
        },
        proxyReqOptDecorator: function(proxyReqOpts) {
          proxyReqOpts.headers['X-Server-Proxy'] = 'Stubborn-server';
          return proxyReqOpts;
        }
      }));
    } else if (item.path) { // We assume the target is a local folder if not an url
      app.use(item.url.replace(/\*$/, ''), express.static(item.path));
    }
  });
};
