const UserRoutes = require('./user/user');
const VechicleRoutes = require('./vehicle/vehicle');

module.exports = (app) => {
  UserRoutes(app);
  VechicleRoutes(app);
};
