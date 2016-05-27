module.exports = (req, res, utils) => {
  let db = utils.db(req);
  if (!isFinite(db.count)) {
    db.count = 10;
  }
  if (db.count > 0) {
    utils.log(`count = ${db.count}... OK`);
    db.count--;
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
