require('dotenv/config');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const PersonalData = require('../../models/PersonalData');
const { authUser } = require('../../middlewares/auth');

module.exports = (app) => {
  app.get('/api/user/check', authUser, async (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Verify user token validate'

    return res.json({
      error: false,
      message: "Acesso permitido"
    });
  });

  app.get('/api/user/list', authUser, async (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'User listing endpoint'

    let { page, size, sort } = req.query;

    if (!page) page = 1;
    if (!size) size = 10;
    if (!sort) sort = 'ASC';

    const limit = parseInt(size);
    const offset = (parseInt(page)-1) * size;

    const totalCount = (await User.findAll()).length;

    const users = await User.findAll({
      attributes: ['id', 'email', 'password', 'role', 'personaldata_id'],
      limit,
      offset,
      order: [
        ['id', sort],
      ]
    });

    if (users.length === 0) {
      return res.status(404).json({
        error: true,
        message: 'Erro: Sem usuários registrados'
      });
    }

    const personaldata_users = await PersonalData.findAll({
      attributes: [
        'id', 'name', 'cpf', 'bornAt', 'phone', 'street', 'number', 'neighborhood', 'city', 'state', 'country'
      ],
    });

    const list = [];

    users.forEach((user) => {
      personaldata_users.forEach((data) => {
        if (user.personaldata_id === data.id) {
          list.push({ ...user.dataValues, ...data.dataValues });
        }
      });
    });

    if (list.length === users.length) {
      return res.json({
        error: false,
        users: list,
        totalCount
      });
    }
  });

  app.post('/api/user/register', async (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'User registration endpoint'

    const data = req.body;

    if (!data.name || !data.email || !data.cpf || !data.password  || !data.bornAt) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Requisição incompleta'
      });
    }

    data.password = await bcrypt.hash(data.password, 8);
    
    const userData = {
      role: data.role,
      email: data.email,
      password: data.password,
      personaldata_id: null
    }

    try {
      await PersonalData.create({
        name: data.name,
        cpf: data.cpf,
        bornAt: data.bornAt
      }).then((e) => {
        userData.personaldata_id = e.id;
      })
      await User.create(userData);
      return res.json({
        error: false,
        message: 'Usuário cadastrado com sucesso!'
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Usuário já existe'
      });
    }
  });

  app.post('/api/user/login', async (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'User login endpoint'

    const user = await User.findOne({
      attributes: ['id', 'email', 'password', 'role'],
      where: {
        email: req.body.email
      }
    });

    if(user === null){
      return res.status(400).json({
        error: true,
        message: "Erro: Usuário ou senha inválidos"
      });
    }

    if(!(await bcrypt.compare(req.body.password, user.password))){
      return res.status(400).json({
        error: true,
        message: "Erro: Usuário ou senha inválidos"
      });
    }

    var token = jwt.sign({id: user.Id}, process.env.JWT_KEY, {
      expiresIn: '1d'
    });

    return res.json({
      error: false,
      message: 'Usuário logado com sucesso',
      authData: {
        userId: user.id,
        token,
        role: user.role
      }
    });
  });
};
