'use strict';
module.exports = app => {
  app.use('/user/:userId/images/:imageId/thumb', (req, res) => {
    res.json(req.params);
  });
};
