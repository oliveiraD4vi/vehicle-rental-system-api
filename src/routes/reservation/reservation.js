const { authUser } = require('../../middlewares/auth');

const Reservation = require('../../models/Reservation');
const User = require('../../models/User');
const Vehicle = require('../../models/Vehicle');

module.exports = (app) => {
  app.post('/api/reservation', authUser, async (req, res) => {
    // #swagger.tags = ['Reservation']
    // #swagger.description = 'Reservation creation endpoint'

    const data = req.body;

    if (!data.user_id || !data.vehicle_id || !data.pickup || !data.devolution) {
      return res.status(400).json({
        error: true,
        message: "Erro: Requisição incompleta"
      });
    }

    const user = await User.findByPk(data.user_id);
    
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Erro: Usuário não encontrado"
      });
    }

    const reserv = await Reservation.findOne({
      attributes: ['user_id', 'step'],
      where: {
        user_id: user.id,
        status: 'CREATED'
      }
    });

    if (reserv) {
      return res.status(400).json({
        error: true,
        message: "Erro: Requisição em andamento, finalize-a primeiro"
      });
    }

    const vehicle = await Vehicle.findByPk(data.vehicle_id);

    if (!vehicle) {
      return res.status(400).json({
        error: true,
        message: "Erro: Veículo não encontrado"
      });
    }

    const reserva = await Reservation.findOne({
      attributes: ['vehicle_id', 'pickup', 'devolution'],
      where: {
        vehicle_id: vehicle.id,
      }
    });

    if (reserva) {
      if (
        (new Date(data.pickup).getTime() > new Date(reserva.pickup).getTime()
          && new Date(data.pickup).getTime() < new Date(reserva.devolution).getTime()) ||
        (new Date(data.devolution).getTime() > new Date(reserva.pickup).getTime()
          && new Date(data.devolution).getTime() < new Date(reserva.devolution).getTime()) ||
        (new Date(reserva.pickup).getTime() === new Date(data.pickup).getTime()
          && new Date(reserva.devolution).getTime() === new Date(data.devolution).getTime())
      ) {
        return res.status(400).json({
          error: true,
          message: "Erro: Veículo não se encontra disponível nestas datas"
        });
      }
    }

    if (!data.status) data.status = "CREATED";
    if (!data.step) data.step = "PERSONAL";

    try {
      await Reservation.create(data);

      return res.json({
        error: false,
        message: 'Reserva criada com status ' + data.status
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Verifique os campos de entrada'
      });
    }
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
