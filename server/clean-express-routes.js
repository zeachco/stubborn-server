module.exports = app => {
  const routes = app._router.stack;

  routes.forEach(removeMiddlewares);

  function removeMiddlewares(route, i, rts) {
    if (route.route) {
      route.route.stack.forEach(removeMiddlewares);
    }
    if (route.path) {
      rts.splice(i, 1);
    }
  }
};
