const Reservation = require('../../../models/Reservation');
const Vehicle = require('../../../models/Vehicle');
const User = require('../../../models/User');

const { authUser } = require('../../../middlewares/auth');
const { getTotalValue } = require('../../../services/reservation');

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

  app.put('/api/reservation/confirm', authUser, async (req, res) => {
    // #swagger.tags = ['Reservation']
    // #swagger.description = 'Reservation vehicle confirm endpoint'

    const { pickup, devolution, reservationId, vehicleId, value } = req.body;

    if (!pickup || !devolution || !reservationId || !vehicleId) {
      return res.status(400).json({
        error: true,
        message: "Erro: Requisição incompleta"
      });
    }

    const reservation = await Reservation.findByPk(reservationId);

    if (!reservation) {
      return res.status(404).json({
        error: true,
        message: "Erro: Reserva não encontrada"
      });
    }

    const vehicle = await Vehicle.findByPk(vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        error: true,
        message: "Erro: Veículo não encontrado"
      });
    }

    const reservationList = await Reservation.findAll({
      attributes: ['vehicle_id', 'pickup', 'devolution'],
      where: {
        vehicle_id: vehicleId,
      }
    });

    if (reservationList) {
      reservationList.forEach((reserva) => {
        if (
          (new Date(pickup).getTime() > new Date(reserva.pickup).getTime()
            && new Date(pickup).getTime() < new Date(reserva.devolution).getTime()) ||
          (new Date(devolution).getTime() > new Date(reserva.pickup).getTime()
            && new Date(devolution).getTime() < new Date(reserva.devolution).getTime()) ||
          (new Date(reserva.pickup).getTime() === new Date(pickup).getTime()
            && new Date(reserva.devolution).getTime() === new Date(devolution).getTime())
        ) {
          return res.status(400).json({
            error: true,
            message: "Erro: Veículo não se encontra disponível nestas datas"
          });
        }
      });
    }

    reservation.pickup = pickup;
    reservation.devolution = devolution;
    reservation.total_value = await getTotalValue(pickup, devolution, vehicle.value);

    if (reservation.pickup && reservation.devolution) {
      try {
        await reservation.save();

        return res.json({
          error: false,
          message: "Reserva atualizada com sucesso"
        });
      } catch (error) {
        return res.status(400).json({
          error: false,
          message: "Não foi possível fazer a confirmação"
        });
      }
    }

    return res.status(400).json({
      error: false,
      message: "Não foi possível fazer a confirmação"
    });
  });

  app.put('/api/reservation/previous', authUser, async (req, res) => {
    // #swagger.tags = ['Reservation']
    // #swagger.description = 'Reservation previous step endpoint'

    const { id } = req.query;

    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({
        error: true,
        message: "Erro: Reserva não encontrada"
      });
    }

    if (reservation.status === "CREATED") {
      switch (reservation.step) {
        case "CONCLUDED":
          reservation.step = "PAYMENT";
        break;
        case "PAYMENT":
          reservation.step = "VEHICLE";
        break;
        case "VEHICLE":
          reservation.step = "PERSONAL";
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
      await Reservation.create({ ...data, pickup: null, devolution: null });

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
