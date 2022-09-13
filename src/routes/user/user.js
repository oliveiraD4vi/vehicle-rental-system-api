require('dotenv/config');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const PersonalData = require('../../models/PersonalData');

module.exports = (app) => {
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
