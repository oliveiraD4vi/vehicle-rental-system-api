const jwt = require('jsonwebtoken');
const { promisify } = require('util');

require('dotenv/config');

module.exports = {
  eAdmin: async function (req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Acesso não permitido'
      });
    }

    const [, token ] = authHeader.split(' ');

    if(!token){
      return res.status(400).json({
        error: true,
        message: 'Erro: Acesso não permitido'
      });
    }

    try {
      const decode = await promisify(jwt.verify) (token, process.env.JWT_KEY);
      req.userId = decode.id;
      return next();
    } catch(err) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Acesso não permitido'
      });
    }
  }
}
