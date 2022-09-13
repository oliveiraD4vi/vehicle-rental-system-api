const express = require('express');
const cors = require('cors');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

app.use(cors());
app.use(express.json());
app.use('/swagger-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

require('dotenv/config');
require('./src/models/database');
require('./src/routes/index')(app);
require('./swagger.js');

app.listen(process.env.PORT, () => {
  console.log("Servidor iniciado corretamente na porta " + process.env.PORT);
});
