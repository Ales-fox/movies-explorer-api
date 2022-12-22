const jwt = require('jsonwebtoken'); // Модуль для создания токенов
const bcrypt = require('bcryptjs'); // Модуль для хеширования пароля

const User = require('../models/user');
const { errorMessage, SECRET_JWT_DEV } = require('../constants');
const Error404 = require('../errors/Error404');
const Error400 = require('../errors/Error400');
const Error409 = require('../errors/Error409');

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10) // Хэшируем пароль, 10 - длина "соли"
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => {
      res.status(200).send({
        name: user.name, email: user.email, _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new Error400(errorMessage.validationError));
      }
      if (err.code === 11000) {
        return next(new Error409(errorMessage.emailExistError));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна
      const { NODE_ENV = 'development', JWT_SECRET = 'Key-secret' } = process.env;
      const token = jwt.sign({ _id: user._id }, (NODE_ENV === 'production' ? JWT_SECRET : SECRET_JWT_DEV), { expiresIn: '7d' }); // в течение 7 дней токен будет действителен
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: 'none' });
      /* res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true }); */
      res.status(200).send({ token });
    })
    .catch((err) => next(err));
};

module.exports.logOut = (req, res, next) => {
  try {
    res.clearCookie('jwt').status(200).send({ message: 'Куки удалены' });
  } catch (err) {
    next(err);
  }
};

module.exports.getMyInfo = (req, res, next) => {
  User.findById(req.user._id).orFail(new Error404(errorMessage.notFoundUser))
    .then((data) => res.send({ email: data.email, name: data.name }))
    .catch((err) => next(err));
};

module.exports.correctMyInfo = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  }).orFail(new Error404(errorMessage.notFoundUser))
    .then((data) => res.send({ email: data.email, name: data.name }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new Error400(errorMessage.validationError));
      }
      if (err.name === 'CastError') {
        return next(new Error400(errorMessage.castError));
      }
      if (err.code === 11000) {
        return next(new Error409(errorMessage.emailExistError));
      }
      return next(err);
    });
};
