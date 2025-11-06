import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "LomdimBioinformatics API",
    version: "1.0.0",
    description: "API documentation for LomdimBioinformatics project",
  },
  host: "localhost:3001",
  basePath: "/api",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/*.js"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
