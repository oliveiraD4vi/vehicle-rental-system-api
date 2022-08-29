const { DataTypes } = require('sequelize');
const db = require('./database');
const PersonalData = require('./PersonalData');

const Vehicle = require('./Vehicle');

const Reservation = db.define('reservations', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Vehicle,
      key: 'id'
    }
  },
  pickup: {
    type: DataTypes.DATE,
    allowNull: false
  },
  devolution: {
    type: DataTypes.DATE,
    allowNull: false
  },
  personal_data: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PersonalData,
      key: 'id'
    }
  },
  step: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'INITIALIZED'
  }
});

// Create table
// User.sync({ alter: true });

module.exports = Reservation;
