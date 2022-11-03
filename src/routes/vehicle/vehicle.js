const Vehicle = require('../../models/Vehicle');

const { authUser } = require('../../middlewares/auth');
const { getRandomList } = require('../../services/vehicle');

module.exports = (app) => {
  app.put('/api/vehicle', async (req, res) => {
    // #swagger.tags = ['Vehicle']
    // #swagger.description = 'Vehicle editing endpoint'

    const { id, brand, model, color, plate, value } = req.body;

    if (!id || !brand || !model || !color || !plate || !value) {
      return res.status(404).json({
        error: true,
        message: "Erro: Requisição incompleta"
      });
    }

    const vehicle = await Vehicle.findByPk(id);

    if (!vehicle) {
      return res.status(404).json({
        error: true,
        message: "Erro: Veículo não encontrado"
      });
    }

    vehicle.brand = await brand;
    vehicle.model = await model;
    vehicle.color = await color;
    vehicle.plate = await plate;
    vehicle.value = await value;

    vehicle.save()
    .then(() => {
      return res.json({
        error: false,
        message: "Informações editadas com sucesso!"
      });
    })
    .catch(() => {
      return res.status(404).json({
        error: true,
        message: "Erro: Não foi possível salvar as informações. Verifique os dados únicos."
      });
    });
  });

  app.get('/api/vehicle/list/random', async (req, res) => {
    // #swagger.tags = ['Vehicle']
    // #swagger.description = 'Vehicle listing 5 random items endpoint'

    await Vehicle.findAll({
      attributes: ['id', 'brand', 'model', 'color', 'plate', 'value'],
    })
    .then(async (cars) => {
      if (cars.length > 0) {
        const randomList = await getRandomList(cars);

        return res.json({
          error: false,
          message: "Lista retornada com sucesso",
          randomList
        });
      } else {
        return res.status(404).json({
          error: true,
          message: "Não há veículos cadastrados"
        });
      }
    })
    .catch(() => {
      return res.status(404).json({
        error: true,
        message: "Erro: Erro desconhecido"
      });
    });
  });

  app.get('/api/vehicle/list', async (req, res) => {
    // #swagger.tags = ['Vehicle']
    // #swagger.description = 'Vehicle listing endpoint'

    let { page, size, sort } = req.query;

    if (!page) page = 1;
    if (!size) size = 10;
    if (!sort) sort = 'ASC';

    const limit = parseInt(size);
    const offset = (parseInt(page)-1) * size;

    const totalCount = (await Vehicle.findAll()).length;

    await Vehicle.findAll({
      attributes: ['id', 'brand', 'model', 'color', 'plate', 'value'],
      limit,
      offset,
      order: [
        ['id', sort],
      ]
    })
    .then((cars) => {
      if (cars.length > 0) {
        return res.json({
          error: false,
          cars,
          totalCount
        });
      } else {
        return res.status(404).json({
          error: true,
          message: 'Erro: Sem carros registrados'
        });
      }
    })
    .catch(() => {
      return res.status(400).json({
        error: true,
        message: 'Erro: Erro desconhecido'
      });
    });
  });

  app.delete('/api/vehicle', authUser, async (req, res) => {
    // #swagger.tags = ['Vehicle']
    // #swagger.description = 'Vehicle delete endpoint'

    const { id } = req.query;

    if (!id) {
      return res.status(404).json({
        error: true,
        message: 'Erro: Requisição incompleta'
      });
    }

    const vehicle = await Vehicle.findOne({
      attributes: ['id'],
      where: {
        id: id,
      }
    });

    if (!vehicle) {
      return res.status(404).json({
        error: true,
        message: 'Erro: Veículo não encontrado'
      });
    }

    await Vehicle.destroy({
      where: {
        id: id,
      }
    })
    .then(() => {
      return res.json({
        error: false,
        message: 'Veículo deletado'
      });
    });
  });

  app.post('/api/vehicle/register', authUser, async (req, res) => {
    // #swagger.tags = ['Vehicle']
    // #swagger.description = 'Vehicle register endpoint'

    const data = req.body;

    if (!data.brand || !data.model || !data.color || !data.plate || !data.value) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Requisição incompleta'
      });
    }

    try {
      await Vehicle.create(data);

      return res.json({
        error: false,
        message: 'Veículo cadastrado com sucesso!'
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Veículo já existe'
      });
    }
  });
};
