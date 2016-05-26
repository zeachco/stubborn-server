module.exports = (req, res, utils) => {
  if (!isFinite(utils.db.count)) {
    utils.db.count = 10;
  }
  if (utils.db.count > 0) {
    utils.log(`count = ${utils.db.count}... OK`);
    utils.db.count--;
    res.status(204);
    res.end();
  } else {
    utils.log(`Failed call ! count = ${utils.db.count}`);
    res.status(401);
    res.json({
      error: 'You can\'t delete that item',
      canadianErrorPrefix: 'Very sorry! '
    });
  }
};
