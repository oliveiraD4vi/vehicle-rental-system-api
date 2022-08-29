const UserRoutes = require('./user/user');
const VechiclesRoutes = require('./vehicle/vehicle');

module.exports = (app) => {
  UserRoutes(app);
  VechiclesRoutes(app);
};
