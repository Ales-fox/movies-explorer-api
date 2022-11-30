const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMyInfo,
  correctMyInfo,
} = require('../controllers/users');

router.get('/me', getMyInfo);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), correctMyInfo);

module.exports = router;