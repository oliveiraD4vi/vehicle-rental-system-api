require('dotenv/config');

const User = require('../../models/User');
const PersonalData = require('../../models/PersonalData');

const { authUser } = require('../../middlewares/auth');
const { Op } = require('sequelize');

module.exports = (app) => {
  app.put('/api/user', authUser, async (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'User editing endpoint'

    const data = req.body;

    const personalData = await PersonalData.findByPk(data.id);

    if (!personalData) {
      return res.status(400).json({
        error: true,
        message: "Erro: Dados pessoais não encontrados"
      });
    }

    personalData.name = await data.name ? data.name : personalData.name;
    personalData.cpf = await data.cpf ? data.cpf : personalData.cpf;
    personalData.bornAt = await data.bornAt ? data.bornAt : personalData.bornAt;
    personalData.phone = await data.phone ? data.phone : personalData.phone;
    personalData.street = await data.street ? data.street : personalData.street;
    personalData.number = await data.number ? data.number : personalData.number;
    personalData.neighborhood = await data.neighborhood ? data.neighborhood : personalData.neighborhood;
    personalData.city = await data.city ? data.city : personalData.city;
    personalData.state = await data.state ? data.state : personalData.state;
    personalData.country = await data.country ? data.country : personalData.country;

    const user = await User.findOne({
      where: {
        personaldata_id: data.id
      }
    });

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Erro: Usuário não encontrado"
      });
    }

    user.role = await data.role ? data.role : user.role;
    user.email = await data.email ? data.email : user.email;

    try {
      personalData.save();
      user.save();
      
      return res.json({
        error: false,
        message: 'Informações editadas com sucesso!'
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Não foi possível completar a operação'
      });
    }
  });

  app.delete('/api/user', authUser, async (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'User delete endpoint'

     const { id } = req.query;

    if (!id) {
      return res.status(404).json({
        error: true,
        message: 'Erro: Requisição incompleta'
      });
    }

    const user = await User.findOne({
      attributes: ['id', 'personaldata_id'],
      where: {
        id: id,
      }
    });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'Erro: Usuário não existe'
      });
    }

    const personaldata = await PersonalData.findOne({
      attributes: ['id'],
      where: {
        id: user.personaldata_id,
      }
    });

    if (!personaldata) {
      return res.status(404).json({
        error: true,
        message: 'Erro: Dados pessoais não existem'
      });
    }

    await User.destroy({
      where: {
        id: id,
      }
    });

    await PersonalData.destroy({
      where: {
        id: personaldata.id
      }
    })
    .then(() => {
      return res.json({
        error: false,
        message: 'Usuário deletado',
      });
    })
    .catch(() => {
      return res.status(400).json({
        error: false,
        message: 'Erro desconhecido',
      });
    });
  });

  app.get('/api/user/personal', authUser, async (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'User personal data get endpoint'

    const { id } = req.query;

    if (!id) {
      return res.status(404).json({
        error: true,
        message: 'Erro: Requisição incompleta'
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'Erro: Usuário não existe'
      });
    }

    const personaldata = await PersonalData.findOne({
      attributes: [
        'id', 'name', 'cpf', 'bornAt', 'phone', 'street', 'number', 'neighborhood', 'city', 'state', 'country'
      ],
      where: {
        id: user.personaldata_id,
      }
    });

    if (!personaldata) {
      return res.status(404).json({
        error: true,
        message: 'Erro: Dados pessoais não existem'
      });
    }

    const userData = { ...user.dataValues, ...personaldata.dataValues };

    if (userData) {
      return res.json({
        error: false,
        user: userData,
      });
    }
  });

  app.get('/api/user', authUser, async (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'User get endpoint'

    const { id } = req.query;

    if (!id) {
      return res.status(404).json({
        error: true,
        message: 'Erro: Requisição incompleta'
      });
    }

    const personaldata = await PersonalData.findOne({
      attributes: [
        'id', 'name', 'cpf', 'bornAt', 'phone', 'street', 'number', 'neighborhood', 'city', 'state', 'country'
      ],
      where: {
        id: id,
      }
    });

    if (!personaldata) {
      return res.status(404).json({
        error: true,
        message: 'Erro: Dados pessoais não existem'
      });
    }

    const user = await User.findOne({
      attributes: ['id', 'email', 'role', 'personaldata_id'],
      where: {
        personaldata_id: personaldata.id,
      }
    });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'Erro: Usuário não existe'
      });
    }

    const userData = { ...user.dataValues, ...personaldata.dataValues };

    if (userData) {
      return res.json({
        error: false,
        user: userData,
      });
    }
  });

  app.get('/api/user/list', authUser, async (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'User listing endpoint'

    let { page, size, sort, search } = req.query;

    if (!page) page = 1;
    if (!size) size = 10;
    if (!sort) sort = 'ASC';
    if (!search) search = '';

    const limit = parseInt(size);
    const offset = (parseInt(page)-1) * size;

    let totalCount = (await User.findAll()).length;

    if (totalCount === 0) {
      return res.status(404).json({
        error: true,
        message: 'Erro: Sem usuários registrados'
      });
    }

    const users = await User.findAll();

    totalCount = (
      await PersonalData.findAll({
        attributes: ['name', 'cpf'],
        where: {
          [Op.or]: [
            { name: { [Op.substring]: search } },
            { cpf: { [Op.substring]: search } }
          ]
        },
      })
    ).length;

    const personaldata_users = await PersonalData.findAll({
      attributes: [
        'id', 'name', 'cpf', 'bornAt', 'phone', 'street', 'number', 'neighborhood', 'city', 'state', 'country'
      ],
      where: {
        [Op.or]: [
          { name: { [Op.substring]: search } },
          { cpf: { [Op.substring]: search } }
        ]
      },
      limit,
      offset,
      order: [
        ['id', sort],
      ]
    });

    const list = [];

    users.forEach((user) => {
      personaldata_users.forEach((data) => {
        if (user.personaldata_id === data.id)
          list.push({ ...user.dataValues, ...data.dataValues });
      });
    });

    if (list.length === personaldata_users.length) {
      if (list.length > 0) {
        return res.json({
          error: false,
          users: list,
          totalCount
        });
      } else {
        return res.status(404).json({
          error: true,
          users: list,
          message: 'Erro: Sem usuários registrados'
        });
      }
    }
  });
};
