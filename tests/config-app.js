'use strict';

const test = require('ava');
const got = require('got');

const stub = require('../');
const { getTestConf } = require('./helpers');

test('express extensions', t => {
  const s = stub();
  return getTestConf()
    .then(defaultTestConfig => {
      s.app.use('/user/:userId/images/:imageId/thumb', (req, res) => {
        const response = Object.assign(
          { definedInCode: true },
          req.params,
          s.config.get()
        );
        res.json(response);
      });
      s.start(defaultTestConfig);
      return 'http://127.0.0.1:' + defaultTestConfig.servePort + '/user/abc123/images/def456/thumb';
    })
    .then(got)
    .then(({ statusCode, body }) => {
      if (statusCode !== 200) {
        throw statusCode + ' ' + body;
      }
      let data = JSON.parse(body);
      t.truthy(data);
      t.is(data.definedInCode, true);
      t.is(data.userId, 'abc123');
      t.is(data.imageId, 'def456');
      s.stop();
    });
});
