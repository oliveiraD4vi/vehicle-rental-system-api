const { Sequelize } = require('sequelize');

require('dotenv/config');

const sequelize = new Sequelize(
  process.env.PG_NAME,
  process.env.PG_USER,
  process.env.PG_PSSW,
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    host: process.env.PG_HOST,
    port: process.env.PG_PORT
  }
);

module.exports = sequelize;
