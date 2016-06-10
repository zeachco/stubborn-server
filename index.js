'use strict';

const fileConfig = require('./server/config');

const api = {};
api.log = require('./server/logger');
api.start = (config) => fileConfig(config) && require('./server')(config) && api;
api.stop = () => require('./server/app').process.close() || api;

module.exports = api;
