module.exports = (req, res) => {
  res.json({
    url: req.url,
    port: req.port,
    hostname: req.hostname,
    type: 'this is an alternative mock service'
  });
};
