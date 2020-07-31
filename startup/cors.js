const cors = require("cors");

module.exports = (app) => {
  app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
  app.options("http://localhost:3000/", cors());
};
