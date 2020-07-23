const fileServices = require("../utils/azureFileService");
// const

module.exports = (app) => {
  app.use("/api/file", fileServices);
};
