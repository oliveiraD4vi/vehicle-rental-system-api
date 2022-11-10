const swaggerAutogen = require('swagger-autogen')();

require('dotenv/config');

const outputFile = './swagger_output.json';
const endpointsFiles = [
  './src/routes/user/user.js',
  './src/routes/vehicle/vehicle.js',
  './src/routes/reservation/reservation.js'
];

const doc = {
  info: {
    version: "1.0.0",
    title: "Vehicle Rental System API",
    description: "API documentation generated by the <b>swagger-autogen</b> module."
  },
  host: process.env.DEFAULT_URL,
  basePath: "/",
  schemes: ['http'],
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
