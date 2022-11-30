const router = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // Валидация входящих данных
const { createUser, login, logOut } = require('../controllers/users');
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { errorMessage } = require('../constants');
const Error404 = require('../errors/Error404');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }).unknown(true),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), login);

router.use(auth); // авторизация; выше всех роутов где она нужна
router.post('/logout', logOut); // Выход из системы
router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', (req, res, next) => { // Ошибка на неизвестные роуты
  next(new Error404(errorMessage.resourseExistError));
});

module.exports = router;