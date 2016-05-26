'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.port = 3000;
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

module.exports = app;
