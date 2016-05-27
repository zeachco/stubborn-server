'use strict';

const DB = {};

module.exports = req => {
  let namespace = req.hostname;
  DB[namespace] = DB[namespace] || {};
  return DB[namespace];
};

module.exports.reset = req => {
  let namespace = req.hostname;
  return DB[namespace] = {};
};
