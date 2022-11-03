"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require('dotenv/config');

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var User = require('../../models/User');

var PersonalData = require('../../models/PersonalData');

var _require = require('../../middlewares/auth'),
    authUser = _require.authUser;

module.exports = function (app) {
  app.get('/api/user/check', authUser, function _callee(req, res) {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", res.json({
              error: false,
              message: "Acesso permitido"
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  app.put('/api/user', authUser, function _callee2(req, res) {
    var data, user, personalData;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // #swagger.tags = ['User']
            // #swagger.description = 'User editing endpoint'
            data = req.body;
            user = User.findByPk(data.id);

            if (user) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt("return", res.status(400).json({
              error: true,
              message: "Erro: Usuário não encontrado"
            }));

          case 4:
            user.role = data.role ? data.role : user.role;
            user.email = data.email ? data.email : user.email;
            user.password = data.password ? data.password : user.password;
            personalData = PersonalData.findByPk(user.personaldata_id);

            if (personalData) {
              _context2.next = 10;
              break;
            }

            return _context2.abrupt("return", res.status(400).json({
              error: true,
              message: "Erro: Dados pessoais não encontrados"
            }));

          case 10:
            name: data.name ? data.name : user.name;

            cpf: data.cpf ? data.cpf : user.cpf;

            bornAt: data.bornAt ? data.bornAt : user.bornAt;

            phone: data.phone ? data.phone : user.phone;

            street: data.street ? data.street : user.street;

            number: data.number ? data.number : user.number;

            neighborhood: data.neighborhood ? data.neighborhood : user.neighborhood;

            city: data.city ? data.city : user.city;

            state: data.state ? data.state : user.state;

            country: data.country ? data.country : user.country;

            _context2.prev = 20;
            _context2.next = 23;
            return regeneratorRuntime.awrap(PersonalData.create(personalData).then(function (e) {
              userData.personaldata_id = e.id;
            }));

          case 23:
            _context2.next = 25;
            return regeneratorRuntime.awrap(User.create(userData));

          case 25:
            return _context2.abrupt("return", res.json({
              error: false,
              message: 'Usuário cadastrado com sucesso!'
            }));

          case 28:
            _context2.prev = 28;
            _context2.t0 = _context2["catch"](20);
            return _context2.abrupt("return", res.status(400).json({
              error: true,
              message: 'Erro: Usuário já existe'
            }));

          case 31:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[20, 28]]);
  });
  app["delete"]('/api/user', authUser, function _callee3(req, res) {
    var id, user, personaldata;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // #swagger.tags = ['User']
            // #swagger.description = 'User delete endpoint'
            id = req.query.id;

            if (id) {
              _context3.next = 3;
              break;
            }

            return _context3.abrupt("return", res.status(404).json({
              error: true,
              message: 'Erro: Requisição incompleta'
            }));

          case 3:
            _context3.next = 5;
            return regeneratorRuntime.awrap(User.findOne({
              attributes: ['id', 'personaldata_id'],
              where: {
                id: id
              }
            }));

          case 5:
            user = _context3.sent;

            if (user) {
              _context3.next = 8;
              break;
            }

            return _context3.abrupt("return", res.status(404).json({
              error: true,
              message: 'Erro: Usuário não existe'
            }));

          case 8:
            _context3.next = 10;
            return regeneratorRuntime.awrap(PersonalData.findOne({
              attributes: ['id'],
              where: {
                id: user.personaldata_id
              }
            }));

          case 10:
            personaldata = _context3.sent;

            if (personaldata) {
              _context3.next = 13;
              break;
            }

            return _context3.abrupt("return", res.status(404).json({
              error: true,
              message: 'Erro: Dados pessoais não existem'
            }));

          case 13:
            _context3.next = 15;
            return regeneratorRuntime.awrap(User.destroy({
              where: {
                id: id
              }
            }));

          case 15:
            _context3.next = 17;
            return regeneratorRuntime.awrap(PersonalData.destroy({
              where: {
                id: personaldata.id
              }
            }).then(function () {
              return res.json({
                error: false,
                message: 'Usuário deletado'
              });
            })["catch"](function () {
              return res.status(400).json({
                error: false,
                message: 'Erro desconhecido'
              });
            }));

          case 17:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
  app.get('/api/user', authUser, function _callee4(req, res) {
    var id, user, personaldata, userData;
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            // #swagger.tags = ['User']
            // #swagger.description = 'User get endpoint'
            id = req.query.id;

            if (id) {
              _context4.next = 3;
              break;
            }

            return _context4.abrupt("return", res.status(404).json({
              error: true,
              message: 'Erro: Requisição incompleta'
            }));

          case 3:
            _context4.next = 5;
            return regeneratorRuntime.awrap(User.findOne({
              attributes: ['id', 'email', 'role', 'personaldata_id'],
              where: {
                id: id
              }
            }));

          case 5:
            user = _context4.sent;

            if (user) {
              _context4.next = 8;
              break;
            }

            return _context4.abrupt("return", res.status(404).json({
              error: true,
              message: 'Erro: Usuário não existe'
            }));

          case 8:
            _context4.next = 10;
            return regeneratorRuntime.awrap(PersonalData.findOne({
              attributes: ['id', 'name', 'cpf', 'bornAt', 'phone', 'street', 'number', 'neighborhood', 'city', 'state', 'country'],
              where: {
                id: user.personaldata_id
              }
            }));

          case 10:
            personaldata = _context4.sent;

            if (personaldata) {
              _context4.next = 13;
              break;
            }

            return _context4.abrupt("return", res.status(404).json({
              error: true,
              message: 'Erro: Dados pessoais não existem'
            }));

          case 13:
            userData = _objectSpread({}, user.dataValues, {}, personaldata.dataValues);

            if (!userData) {
              _context4.next = 16;
              break;
            }

            return _context4.abrupt("return", res.json({
              error: false,
              user: userData
            }));

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    });
  });
  app.get('/api/user/list', authUser, function _callee5(req, res) {
    var _req$query, page, size, sort, limit, offset, totalCount, users, personaldata_users, list;

    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            // #swagger.tags = ['User']
            // #swagger.description = 'User listing endpoint'
            _req$query = req.query, page = _req$query.page, size = _req$query.size, sort = _req$query.sort;
            if (!page) page = 1;
            if (!size) size = 10;
            if (!sort) sort = 'ASC';
            limit = parseInt(size);
            offset = (parseInt(page) - 1) * size;
            _context5.next = 8;
            return regeneratorRuntime.awrap(User.findAll());

          case 8:
            totalCount = _context5.sent.length;
            _context5.next = 11;
            return regeneratorRuntime.awrap(User.findAll({
              attributes: ['id', 'email', 'role', 'personaldata_id'],
              limit: limit,
              offset: offset,
              order: [['id', sort]]
            }));

          case 11:
            users = _context5.sent;

            if (!(users.length === 0)) {
              _context5.next = 14;
              break;
            }

            return _context5.abrupt("return", res.status(404).json({
              error: true,
              message: 'Erro: Sem usuários registrados'
            }));

          case 14:
            _context5.next = 16;
            return regeneratorRuntime.awrap(PersonalData.findAll({
              attributes: ['id', 'name', 'cpf', 'bornAt', 'phone', 'street', 'number', 'neighborhood', 'city', 'state', 'country']
            }));

          case 16:
            personaldata_users = _context5.sent;
            list = [];
            users.forEach(function (user) {
              personaldata_users.forEach(function (data) {
                if (user.personaldata_id === data.id) {
                  list.push(_objectSpread({}, user.dataValues, {}, data.dataValues));
                }
              });
            });

            if (!(list.length === users.length)) {
              _context5.next = 21;
              break;
            }

            return _context5.abrupt("return", res.json({
              error: false,
              users: list,
              totalCount: totalCount
            }));

          case 21:
          case "end":
            return _context5.stop();
        }
      }
    });
  });
  app.post('/api/user/register', function _callee6(req, res) {
    var data, userData, personalData;
    return regeneratorRuntime.async(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            // #swagger.tags = ['User']
            // #swagger.description = 'User registration endpoint'
            data = req.body;

            if (!(!data.name || !data.email || !data.cpf || !data.password || !data.bornAt)) {
              _context6.next = 3;
              break;
            }

            return _context6.abrupt("return", res.status(400).json({
              error: true,
              message: 'Erro: Requisição incompleta'
            }));

          case 3:
            _context6.next = 5;
            return regeneratorRuntime.awrap(bcrypt.hash(data.password, 8));

          case 5:
            data.password = _context6.sent;
            userData = {
              role: data.role,
              email: data.email,
              password: data.password,
              personaldata_id: null
            };
            personalData = {
              name: data.name,
              cpf: data.cpf,
              bornAt: data.bornAt,
              phone: data.phone ? data.phone : null,
              street: data.street ? data.street : null,
              number: data.number ? data.number : null,
              neighborhood: data.neighborhood ? data.neighborhood : null,
              city: data.city ? data.city : null,
              state: data.state ? data.state : null,
              country: data.country ? data.country : null
            };
            _context6.prev = 8;
            _context6.next = 11;
            return regeneratorRuntime.awrap(PersonalData.create(personalData).then(function (e) {
              userData.personaldata_id = e.id;
            }));

          case 11:
            _context6.next = 13;
            return regeneratorRuntime.awrap(User.create(userData));

          case 13:
            return _context6.abrupt("return", res.json({
              error: false,
              message: 'Usuário cadastrado com sucesso!'
            }));

          case 16:
            _context6.prev = 16;
            _context6.t0 = _context6["catch"](8);
            return _context6.abrupt("return", res.status(400).json({
              error: true,
              message: 'Erro: Usuário já existe'
            }));

          case 19:
          case "end":
            return _context6.stop();
        }
      }
    }, null, null, [[8, 16]]);
  });
  app.post('/api/user/login', function _callee7(req, res) {
    var user, token;
    return regeneratorRuntime.async(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return regeneratorRuntime.awrap(User.findOne({
              attributes: ['id', 'email', 'password', 'role'],
              where: {
                email: req.body.email
              }
            }));

          case 2:
            user = _context7.sent;

            if (!(user === null)) {
              _context7.next = 5;
              break;
            }

            return _context7.abrupt("return", res.status(400).json({
              error: true,
              message: "Erro: Usuário ou senha inválidos"
            }));

          case 5:
            _context7.next = 7;
            return regeneratorRuntime.awrap(bcrypt.compare(req.body.password, user.password));

          case 7:
            if (_context7.sent) {
              _context7.next = 9;
              break;
            }

            return _context7.abrupt("return", res.status(400).json({
              error: true,
              message: "Erro: Usuário ou senha inválidos"
            }));

          case 9:
            token = jwt.sign({
              id: user.Id
            }, process.env.JWT_KEY, {
              expiresIn: '1d'
            });
            return _context7.abrupt("return", res.json({
              error: false,
              message: 'Usuário logado com sucesso',
              authData: {
                userId: user.id,
                token: token,
                role: user.role
              }
            }));

          case 11:
          case "end":
            return _context7.stop();
        }
      }
    });
  });
};