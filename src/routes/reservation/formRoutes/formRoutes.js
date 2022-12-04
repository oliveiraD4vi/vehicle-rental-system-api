const Reservation = require('../../../models/Reservation');

const { authUser } = require('../../../middlewares/auth');

module.exports = (app) => {
  app.get('/api/reservation/last', authUser, async (req, res) => {
    // #swagger.tags = ['Reservation']
    // #swagger.description = 'Get last ongoing reservation endpoint'

    const { id } = req.query;

    const reservation = await Reservation.findOne({
      attributes: ['id', 'vehicle_id', 'pickup', 'devolution', 'user_id', 'step', 'status'],
      where: {
        user_id: id,
        status: 'CREATED'
      }
    });

    if (!reservation) {
      return res.status(404).json({
        error: true,
        message: "Erro: Não existem reservas em andamento"
      });
    }

    return res.json({
      error: false,
      message: "Reserva em andamento encontrada",
      reservation,
    });
  });

  app.put('/api/reservation/next', authUser, async (req, res) => {
    // #swagger.tags = ['Reservation']
    // #swagger.description = 'Reservation next step endpoint'

    const { id } = req.query;

    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({
        error: true,
        message: "Erro: Reserva não encontrada"
      });
    }

    return res.json({
      error: false,
      message: "Reserva atualizada com sucesso!"
    });
  });
};
