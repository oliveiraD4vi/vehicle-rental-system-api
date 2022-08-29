const { DataTypes } = require('sequelize');
const db = require('./database');

const PersonalData = require('./PersonalData');

const User = db.define('users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'CLIENT'
  },
  personaldata_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PersonalData,
      key: 'id'
    }
  }
});

// Create table
// User.sync({ alter: true });

module.exports = User;
