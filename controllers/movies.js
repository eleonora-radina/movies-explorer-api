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
} = require('../utils/constants');

const createMovie = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const {
      country, director, duration, year, description, image, trailerLink,
      thumbnail, movieId, nameRU, nameEN,
    } = req.body;

    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner,
    });

    return res.send(movie);
  } catch (e) {
    if (e.name === validationErrorName) {
      return next(new BadRequestError(badRequestErrorMessage));
    } return next(new InternalServerError(internalServerErrorMessage));
  }
};

const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({});
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
