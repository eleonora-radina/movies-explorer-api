const Movie = require('../models/movie');

const ForbiddenError = require('../errors/ForbiddenError');
const InternalServerError = require('../errors/InternalServerError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const {
  badRequestErrorMessage,
  internalServerErrorMessage,
  notFoundFilmErrorMessage,
  forbiddenFilmErrorMessage,
  validationErrorName,
  castErrorName,
  notFoundFilmsErrorMessage,
} = require('../utils/constants');

const createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create({ ...req.body, owner: req.user._id });
    return res.send(movie);
  } catch (e) {
    if (e.name === validationErrorName) {
      return next(new BadRequestError(badRequestErrorMessage));
    } return next(new InternalServerError(internalServerErrorMessage));
  }
};

const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    if (!movies.toString()) {
      return next(new NotFoundError(notFoundFilmsErrorMessage));
    }
    return res.send(movies);
  } catch (e) {
    return next(new InternalServerError(internalServerErrorMessage));
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return next(new NotFoundError(notFoundFilmErrorMessage));
    }
    if (userId !== movie.owner.toString()) {
      return next(new ForbiddenError(forbiddenFilmErrorMessage));
    }
    const movieDeleted = await Movie.findByIdAndRemove(movieId);
    return res.send(movieDeleted);
  } catch (e) {
    if (e.name === castErrorName) {
      return next(new BadRequestError(badRequestErrorMessage));
    } return next(new InternalServerError(internalServerErrorMessage));
  }
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
};
