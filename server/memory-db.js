'use strict';

const DB = {};

const getSpace = req => {
  if (!req) {
    throw 'Database methods must be called with a request';
  }
  return req.hostname || 'default';
};

module.exports = req => {
  let namespace = getSpace(req);
  DB[namespace] = DB[namespace] || {};
  return DB[namespace];
};

module.exports.reset = req => {
  let namespace = getSpace(req);
  DB[namespace] = Object.assign({}, DB[namespace]._dbInitState);
};

module.exports.commit = req => {
  let namespace = getSpace(req);
  delete DB[namespace]._dbInitState;
  DB[namespace]._dbInitState = Object.assign({}, DB[namespace]);
};

module.exports._root = DB;
