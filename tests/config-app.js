'use strict';
const test = require('ava');
const request = require('request');

module.exports = options => {
  const defaultTestConfig = options.defaultTestConfig;
  const stub = options.stub;

  test('express extensions', t => {
    let target = 'http://127.0.0.1:' + defaultTestConfig.servePort + '/user/abc123/images/def456/thumb';
    return new Promise((resolve, reject) => {

      stub.app.use('/user/:userId/images/:imageId/thumb', (req, res) => {
        const response = Object.assign(
          { definedInCode: true },
          req.params,
          stub.config.get()
        );
        res.json(response);
      });
      stub.start(defaultTestConfig);
      request(target, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          let data = JSON.parse(body);
          t.truthy(data);
          t.is(data.definedInCode, true);
          t.is(data.userId, 'abc123');
          t.is(data.imageId, 'def456');
          resolve();
        } else {
          reject(error || response.statusCode + ' ' + response.body);
        }
        stub.stop();
      });
    });
  });
};
