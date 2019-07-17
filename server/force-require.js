const Module = require('module');

const originalRequire = Module.prototype.require;

const forceRequire = () => {
  Module.prototype.require = function hijacked(file) {
    const resolved = Module._resolveFilename(file, this, false);
    delete require.cache[resolved];
    return originalRequire.apply(this, arguments);
  };
};

const restoreRequire = () => {
  Module.prototype.require = originalRequire;
};

const wrapForceRequire = (fn, ...args) => {
  forceRequire();
  const result = fn(...args);
  restoreRequire();
  return result;
};

module.exports = {
  forceRequire,
  restoreRequire,
  wrapForceRequire
};
