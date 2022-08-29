const { DataTypes } = require('sequelize');
const db = require('./database');

const User = db.define('users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bornAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'CLIENT'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Create table
// User.sync({ alter: true });

module.exports = User;
