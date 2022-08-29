const { DataTypes } = require('sequelize');
const db = require('./database');

const User = require('./User');

const PersonalData = db.define('', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  street: {
    type: DataTypes.STRING,
    allowNull: true
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  neighborhood: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Create table
// User.sync({ alter: true });

module.exports = PersonalData;
