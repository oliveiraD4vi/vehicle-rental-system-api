const UserRoutes = require('./user/user');
const VechicleRoutes = require('./vehicle/vehicle');
const ReservationRoutes = require('./reservation/reservation');

module.exports = (app) => {
  UserRoutes(app);
  VechicleRoutes(app);
  ReservationRoutes(app);
};
