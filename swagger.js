const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/routes/user/user.js', './src/routes/vehicle/vehicle.js'];

const doc = {
  info: {
    version: "1.0.0",
    title: "Vehicle Rental System API",
    description: "API documentation generated by the <b>swagger-autogen</b> module."
  },
  host: "localhost:8080",
  basePath: "/",
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      "name": "User",
      "description": "User endpoints"
    },
    {
      "name": "Vehicle",
      "description": "Vehicle endpoints"
    },
    {
      "name": "Reservation",
      "description": "Reservation endpoints"
    }
  ],
};

swaggerAutogen(outputFile, endpointsFiles, doc);