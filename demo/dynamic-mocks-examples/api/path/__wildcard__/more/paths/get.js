module.exports = (req, res, utils, self) => {
  res.json({
    type: 'dynamic-mock',
    url: req.url,
    token: self.matches[1]
  });
};
