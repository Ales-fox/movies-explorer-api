const Movie = require('../models/movie');
const { errorMessage } = require('../constants');
const Error400 = require('../errors/Error400');
const Error403 = require('../errors/Error403');
const Error404 = require('../errors/Error404');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate('owner')
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.postMovie = (req, res, next) => {
  // eslint-disable-next-line max-len, object-curly-newline
  const { country, director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN } = req.body;
  const doc = new Movie({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  });
  doc.save()
    .then((dataMovie) => {
      dataMovie.populate('owner')
        .then((movie) => res.status(200).send(movie));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new Error400(errorMessage.validationError));
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  // Если функция не находит эл-т с таким id, то метод orFail создает ошибку и кидает в блок catch
  Movie.findById(req.params.movieId)
    .populate('owner')
    .orFail(new Error404(errorMessage.notFoundMovie))
    .then((movie) => {
      if (movie.owner._id.toHexString() !== req.user._id) {
        throw new Error403(errorMessage.forbiddenError);
      }
      return Movie.findByIdAndRemove(req.params.movieId);
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