const cors = require("cors");

module.exports = (app) => {
  app.use(cors());
  app.options("http://localhost:3000/", cors());
};
