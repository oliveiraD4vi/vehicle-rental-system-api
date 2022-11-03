const { authUser } = require('../../middlewares/auth');

const Reservation = require('../../models/Reservation');

module.exports = (app) => {
  app.post('/api/reservation', authUser, async (req, res) => {
    // #swagger.tags = ['Reservation']
    // #swagger.description = 'Reservation creation endpoint'
  });

  app.put('/api/reservation', authUser, async (req, res) => {
    // #swagger.tags = ['Reservation']
    // #swagger.description = 'Reservation editing endpoint'
  });

  app.delete('/api/reservation', authUser, async (req, res) => {
    // #swagger.tags = ['Reservation']
    // #swagger.description = 'Reservation delete endpoint'
  });

  app.get('/api/reservation', authUser, async (req, res) => {
    // #swagger.tags = ['Reservation']
    // #swagger.description = 'Reservation get endpoint'
  });

  app.get('/api/reservation/list', authUser, async (req, res) => {
    // #swagger.tags = ['Reservation']
    // #swagger.description = 'Reservation listing endpoint'
  });
};
