require('dotenv/config');

const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

const User = require('../../models/User');

module.exports = (app) => {
  app.post('/register', async (req, res) => {
    const data = req.body;

    if (!data.name || !data.email || !data.cpf || !data.password  || !data.bornAt) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Requisição incompleta'
      });
    }

    data.password = await bcrypt.hash(data.password, 8);

    try {
      await User.create(data);
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
};
