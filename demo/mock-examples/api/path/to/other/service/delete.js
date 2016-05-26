module.exports = (req, res) => {
  res.status(401);
  res.json({
    error: 'You can\'t delete that item',
    canadianErrorPrefix: 'Very sorry! '
  });
};
