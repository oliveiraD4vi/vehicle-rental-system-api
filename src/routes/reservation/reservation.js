const { Op } = require('sequelize');
const { authUser } = require('../../middlewares/auth');

const Reservation = require('../../models/Reservation');
const Vehicle = require('../../models/Vehicle');
const User = require('../../models/User');

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
    
    if (!user || user.role === "ADMIN") {
      return res.status(404).json({
        error: true,
        message: "Erro: Usuário não encontrado"
      });
    }

    const reserv = await Reservation.findOne({
      attributes: ['user_id', 'status'],
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

    const reservationList = await Reservation.findAll({
      attributes: ['vehicle_id', 'pickup', 'devolution'],
      where: {
        vehicle_id: vehicle.id,
      }
    });

    if (reservationList) {
      reservationList.forEach((reserva) => {
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
      });
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

    const { id, step, status } = req.body;

    if (!id || !step || !status) {
      return res.status(404).json({
        error: true,
        message: "Erro: Requisição incompleta"
      });
    }

    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({
        error: true,
        message: "Erro: Reserva não encontrada"
      });
    }

    reservation.step = await step;
    reservation.status = await status;

    reservation.save()
    .then(() => {
      return res.json({
        error: false,
        message: "Informações editadas com sucesso!"
      });
    })
    .catch(() => {
      return res.status(404).json({
        error: true,
        message: "Erro: Verifique os dados únicos"
      });
    });
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

  app.get('/api/reservation/user', authUser, async (req, res) => {
    // #swagger.tags = ['Reservation']
    // #swagger.description = 'User reservations listing endpoint'

    let { page, size, sort, id } = req.query;

    if (!page) page = 1;
    if (!size) size = 10;
    if (!sort) sort = 'DESC';
    if (!id) {
      return res.status(404).json({
        error: true,
        message: 'Erro: Requisição incompleta'
      });
    }

    const limit = parseInt(size);
    const offset = (parseInt(page)-1) * size;

    const totalCount = (await Reservation.findAll({
      attributes: ['user_id'],
      where: {
        user_id: id,
      }
    })).length;

    if (totalCount === 0) {
      return res.status(404).json({
        error: false,
        reservations: [],
        message: 'Sem reservas registradas'
      });
    }

    await Reservation.findAll({
      attributes: [
        'id', 'user_id', 'vehicle_id', 'pickup', 'devolution', 'step', 'status', 'total_value'
      ],
      limit,
      offset,
      order: [['id', sort]],
      where: { user_id: id }
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

  app.get('/api/reservation/list', authUser, async (req, res) => {
    // #swagger.tags = ['Reservation']
    // #swagger.description = 'Reservation listing endpoint'

    let { page, size, sort, search } = req.query;

    if (!page) page = 1;
    if (!size) size = 10;
    if (!sort) sort = 'ASC';
    if (!search) search = '';

    const limit = parseInt(size);
    const offset = (parseInt(page)-1) * size;

    const totalCount = (await Reservation.findAll({
      attributes: ['step', 'status'],
      where: {
        [Op.or]: [
          { step: { [Op.substring]: search } },
          { status: { [Op.substring]: search } }
        ]
      }
    })).length;

    await Reservation.findAll({
      attributes: [
        'id', 'user_id', 'vehicle_id', 'pickup', 'devolution', 'step', 'status', 'total_value'
      ],
      where: {
        [Op.or]: [
          { step: { [Op.iLike]: `%${search}%` } },
          { status: { [Op.iLike]: `%${search}%` } },
          { pickup: { [Op.iLike]: `%${search}%` } },
          { devolution: { [Op.iLike]: `%${search}%` } },
        ]
      },
      limit,
      offset,
      order: [
        ['id', sort],
      ]
    })
    .then((reservations) => {
      if (reservations.length > 0) {
        return res.json({
          error: false,
          reservations,
          totalCount
        });
      } else {
        return res.status(404).json({
          error: true,
          reservations,
          message: 'Erro: Sem reservas registradas'
        });
      }
    })
    .catch(() => {
      return res.status(500).json({
        error: true,
        message: 'Erro: Erro desconhecido'
      });
    });
  });
};
