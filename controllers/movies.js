const Movie = require('../models/movie');
const { errorMessage } = require('../constants');
const Error400 = require('../errors/Error400');
const Error403 = require('../errors/Error403');
const Error404 = require('../errors/Error404');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.postMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    id,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    id,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new Error400(errorMessage.validationError));
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  // Если функция не находит эл-т с таким id, то метод orFail создает ошибку и кидает в блок catch
  Movie.findById(req.params._id)
    .orFail(new Error404(errorMessage.notFoundMovie))
    .then((movie) => {
      if (movie.owner.toHexString() !== req.user._id) {
        throw new Error403(errorMessage.forbiddenError);
      }
      return Movie.findByIdAndRemove(req.params._id);
    })
    .then((deleteData) => {
      res.send(deleteData);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new Error400(errorMessage.castError));
      }
      return next(err);
    });
};
