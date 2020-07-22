const fileServices = require("../utils/fileServices");

module.exports = (app) => {
  app.use("/api/file", fileServices);
};
