'use strict';

const express = require('express');
const path = require('path');
const log = require('./logger');
const memoryDb = require('./memory-db');
module.exports = app => {
  app.get('/stubborn/scenario', (req, res) => {
    log.info(req.hostname);
    memoryDb[req.params.token] = req.body;
    res.json(memoryDb);
  });

  app.get('/scenario/teardown/:token', (req, res) => {
    delete memoryDb[req.params.token];
    res.status = 204;
    res.end();
  });

  app.use('/stubborn', express.static(path.join(process.cwd(), 'client')));
};
