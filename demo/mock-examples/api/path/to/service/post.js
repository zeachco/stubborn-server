module.exports = function(req, res) {
  res.json({
    whatItRealyGet: 'api/path/to/service/post.js',
    payload: req.body
  });
};
