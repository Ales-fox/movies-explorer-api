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
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }).unknown(true),
}), postMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.number().required(),
  }).unknown(true),
}), deleteMovie);

module.exports = router;
