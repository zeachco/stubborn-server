'use strict';
module.exports = (app, stub) => {
  app.use('/user/:userId/images/:imageId/thumb', (req, res) => {
    const response = Object.assign({}, req.params, stub.config.get());
    res.json(response);
  });
};
