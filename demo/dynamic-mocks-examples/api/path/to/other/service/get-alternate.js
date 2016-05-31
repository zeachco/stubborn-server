module.exports = (req, res) => {
  res.json({
    test: 'targeting alternate',
    whatItRealyGet: __filename
  });
};
