const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { linkPatternValidation } = require('../constants');

const { getMovies, postMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().min(4).pattern(linkPatternValidation),
    trailerLink: Joi.string().required().min(4).pattern(linkPatternValidation),
    thumbnail: Joi.string().required().min(4).pattern(linkPatternValidation),
    id: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }).unknown(true),
}), postMovie);

router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().pattern(/[a-f0-9]{24,24}/).length(24),
  }).unknown(true),
}), deleteMovie);

module.exports = router;
