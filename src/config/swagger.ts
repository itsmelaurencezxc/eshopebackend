import swaggerJsdoc from "swagger-jsdoc";
import config from "./index";

// swagger-jsdoc reads the `@swagger` JSDoc comments sitting above each route
// (see src/router/**/*.ts) and turns them into an OpenAPI spec. Add a new
// comment block above any new route you write and it shows up here for free.
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "eshope E-commerce API",
      version: "1.0.0",
      description:
        "REST API documentation for the marketplace backend (buyer, seller, and admin endpoints).",
    },
    servers: [
      {
        url: config.url.local,
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [],
  },
  apis: ["./src/router/**/*.ts"],
});

export default swaggerSpec;
