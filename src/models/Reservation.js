const { DataTypes } = require('sequelize');
const db = require('./database');

const User = require('./User');
const Vehicle = require('./Vehicle');

const Reservation = db.define('reservations', {
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
// Reservation.sync({ alter: true });

module.exports = Reservation;
