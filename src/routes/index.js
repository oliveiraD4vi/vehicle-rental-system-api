const UserRoutes = require('./user/user');
const UserAuthRoutes = require('./user/auth/userAuth');
const VechicleRoutes = require('./vehicle/vehicle');
const ReservationRoutes = require('./reservation/reservation');

module.exports = (app) => {
  UserRoutes(app);
  UserAuthRoutes(app);
  VechicleRoutes(app);
  ReservationRoutes(app);
};
