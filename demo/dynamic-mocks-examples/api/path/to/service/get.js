module.exports = (req, res) => {
  console.log(req);
  res.json({
    url: req.url,
    port: req.port,
    hostname: req.hostname
  });
};
