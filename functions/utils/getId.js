const getId = module.exports = (urlPath) =>
    urlPath.match(/([^\/]*)\/*$/)[0];
  