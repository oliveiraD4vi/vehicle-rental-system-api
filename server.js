const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

require('dotenv/config');

app.listen(process.env.PORT, () => {
  console.log("Servidor iniciado corretamente");
});
