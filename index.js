'use strict';

global._require = (file => {
  return require(require('path').join(process.cwd(), 'server', file));
});

global._require = (file => {
  return require(require('path').join(process.cwd(), 'server', file));
});

const app = _require('app');
const log = _require('logger');

app.use('/api', (req, res, next) => {
  log.info(req.hostname);
  log.warn(req.params);
  next();
});

app.listen(app.port, () => {
  log.success(`Server is running at http://127.0.0.1:${app.port}`);
});
