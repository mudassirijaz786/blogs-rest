const helmet = require("helmet");
const frameguard = require("frameguard");
const frontEndURL = require("config").get("frontEndURL");

module.exports = (app) => {
  app.use(helmet());
  app.use(helmet.xssFilter());
  app.use(helmet.noCache());
  app.use(helmet.noSniff());
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());
  // app.use(
  //   frameguard({
  //     action: "allow-from",
  //     domain: frontEndURL,
  //   })
  // );
};
