const winston = require("winston");
const express = require("express");
const config = require("config");
const app = express();

require("./startup/cors")(app);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
require("./startup/security")(app);
require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/utils")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/socket")(app);

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}`)
);

module.exports = server;
