module.exports = (req, res, utils) => {
  res.json({
    customPath: utils.config.get().customPath
  });
};
