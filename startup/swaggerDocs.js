const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const config = require("config");

module.exports = (app) => {
  // Extended: https://swagger.io/specification/#infoObject
  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: "1.0.1",
        title: "Unnic",
        description: "Unnic API docs",
        contact: {
          name: "Sabir and co developers",
        },
        servers: [`http://localhost:${config.get("port")}`],
        basePath: "/api",
      },
    },
    apis: ["./docs/**/*.yaml"],
  };
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
