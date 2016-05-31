'use strict';

const fileConfig = require('./server/config');

const api = {};
api.log = require('./server/logger') && api;
api.start = (config) => fileConfig(config) && require('./server') && api;
api.stop = () => require('./server/app').process.close() && api;

module.exports = api;
