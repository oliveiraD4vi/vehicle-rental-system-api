const { authUser } = require('../../middlewares/auth');

const Vehicle = require('../../models/Vehicle');

module.exports = (app) => {
  app.get('/cars', authUser, async (req, res) => {
    await Vehicle.findAll({
      attributes: ['id', 'brand', 'model', 'color', 'plate', 'inventory', 'value']
    })
    .then((cars) => {
      if (cars.length > 0) {
        return res.json({
          error: false,
          cars,
        });
      } else {
        return res.status(400).json({
          error: true,
          message: "Erro: Sem carros registrados"
        });
      }
    })
    .catch(() => {
      return res.status(400).json({
        error: true,
        message: "Erro: Erro desconhecido"
      });
    });
  });
};
