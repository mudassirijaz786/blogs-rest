const helmet = require("helmet");

module.exports = (app) => {
  app.use(helmet());
  app.use(helmet.xssFilter());
  app.use(helmet.noCache());
  app.use(helmet.noSniff());
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());
};
