module.exports = (req, res, utils) => {
  global.console.log('here is an illegal log! Hard to find where that comes from right?');
  utils.log('so please use "utils.log()" to display messages');
  res.json({
    test: 'example',
    whatItRealyGet: 'mocks/api/path/to/other/service/get.js'
  });
};
