module.exports = function(req, res) {
  res.json({
    whatItRealyGet: __filename,
    payload: req.body
  });
};
