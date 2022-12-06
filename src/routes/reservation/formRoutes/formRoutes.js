const Reservation = require('../../../models/Reservation');
const Vehicle = require('../../../models/Vehicle');
const User = require('../../../models/User');

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

    switch (reservation.step) {
      case "PERSONAL":
        reservation.step = "VEHICLE";
        break;
      case "VEHICLE":
        reservation.step = "PAYMENT";
        break;
      case "PAYMENT":
        reservation.step = "CONCLUDED";
        break;
      default:
        break;
    }

    if (reservation.step === "CONCLUDED") {
      switch (reservation.status) {
        case "CREATED":
          reservation.status = "CONFIRMED";
          break;
        case "CONFIRMED":
          reservation.status = "PICKUP";
          break;
        case "PICKUP":
          reservation.status = "FINALIZED";
          break;
        default:
          break;
      }
    }

    reservation.save()
    .then(() => {
      return res.json({
        error: false,
        message: "Reserva atualizada com sucesso!"
      });
    })
    .catch(() => {
      return res.status(404).json({
        error: true,
        message: "Erro: Verifique os dados passados"
      });
    });
  });

  app.post('/api/reservation/form', authUser, async (req, res) => {
    // #swagger.tags = ['Reservation']
    // #swagger.description = 'Reservation Form creation endpoint'

    const data = req.body;

    if (!data.user_id || !data.vehicle_id) {
      return res.status(400).json({
        error: true,
        message: "Erro: Requisição incompleta"
      });
    }

    const user = await User.findByPk(data.user_id);

    if (!user || user.role === "ADMIN") {
      return res.status(404).json({
        error: true,
        message: "Erro: Usuário não encontrado"
      });
    }

    const vehicle = await Vehicle.findByPk(data.vehicle_id);

    if (!vehicle) {
      return res.status(400).json({
        error: true,
        message: "Erro: Veículo não encontrado"
      });
    }

    try {
      await Reservation.create(data);

      return res.json({
        error: false,
        message: 'Reserva criada com status PERSONAL'
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Verifique os campos de entrada'
      });
    }
  });
};
