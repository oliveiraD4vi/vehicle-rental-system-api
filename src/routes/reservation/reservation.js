const { authUser } = require('../../middlewares/auth');
const PersonalData = require('../../models/PersonalData');

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

    const { id } = req.query;

    if (!id) {
      return res.status(404).json({
        error: true,
        message: 'Erro: Requisição incompleta'
      });
    }

    const reservation = await Reservation.findByPk(id);
    
    if (!reservation) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Reserva não encontrada'
      });
    }

    await Reservation.destroy({
      where: {
        id: id,
      }
    })
    .then(() => {
      return res.json({
        error: false,
        message: 'Reserva deletada com sucesso!'
      });
    })
    .catch(() => {
      return res.status(400).json({
        error: false,
        message: 'Erro desconhecido',
      });
    });
  });

  app.get('/api/reservation', authUser, async (req, res) => {
    // #swagger.tags = ['Reservation']
    // #swagger.description = 'Reservation get endpoint'

    const { id } = req.query;

    if (!id) {
      return res.status(404).json({
        error: true,
        message: 'Erro: Requisição incompleta'
      });
    }

    await Reservation.findByPk(id)
    .then((reservation) => {
      return res.json({
        error: false,
        reservation,
        message: 'Reserva encontrada com sucesso!'
      });
    })
    .catch(() => {
      return res.status(400).json({
        error: true,
        message: 'Erro: Reserva não encontrada'
      });
    });
  });

  app.get('/api/reservation/list', authUser, async (req, res) => {
    // #swagger.tags = ['Reservation']
    // #swagger.description = 'Reservation listing endpoint'

    let { page, size, sort } = req.query;

    if (!page) page = 1;
    if (!size) size = 10;
    if (!sort) sort = 'ASC';

    const limit = parseInt(size);
    const offset = (parseInt(page)-1) * size;

    const totalCount = (await Reservation.findAll()).length;

    if (totalCount === 0) {
      return res.status(404).json({
        error: true,
        message: 'Erro: Sem reservas registradas'
      });
    }

    await Reservation.findAll({
      attributes: [
        'id', 'user_id', 'vehicle_id', 'pickup', 'devolution', 'step', 'status'
      ],
      limit,
      offset,
      order: [
        ['id', sort],
      ]
    })
    .then((reservations) => {
      return res.json({
        error: false,
        reservations,
        totalCount
      });
    })
    .catch(() => {
      return res.status(500).json({
        error: true,
        message: 'Erro: Erro desconhecido'
      });
    });
  });
};
