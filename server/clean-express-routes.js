module.exports = stub => {
  const { app } = stub;
  const routes = app && app._router && app._router.stack;

  function removeMiddlewares(route, i, rts) {
    if (route.route) {
      route.route.stack.forEach(removeMiddlewares);
    }
    if (route.path) {
      rts.splice(i, 1);
    }
  }

  (routes || []).forEach(removeMiddlewares);
};
