var stub = require('..');
stub.start({
  verbose: true,
  servePort: 9876
});
stub.stop();
stub.log.success('server started and stopped without issues');
