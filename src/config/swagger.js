const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ecommerce Backend API",
      version: "1.0.0",
      description: "API documentation for backend-learning project"
    },
    servers: [
      {
        url: "https://glorious-garbanzo-wrvpxp9r5w629vxv-5000.app.github.dev/"
      }
    ]
  },

  // files containing annotations
  apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;