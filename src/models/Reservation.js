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
    allowNull: true,
    references: {
      model: Vehicle,
      key: 'id'
    }
  },
  pickup: {
    type: DataTypes.DATE,
    allowNull: true
  },
  devolution: {
    type: DataTypes.DATE,
    allowNull: true
  },
  step: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'PERSONAL'
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'CREATED'
  },
  total_value: {
    type: DataTypes.FLOAT,
    allowNull: true,
  }
});

// Create table
// Reservation.sync({ alter: true });

module.exports = Reservation;
