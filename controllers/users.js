const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { NODE_ENV, JWT_SECRET } = process.env;
const { JWT_SECRET_DEV } = require('../utils/config');

const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const InternalServerError = require('../errors/InternalServerError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const {
  badRequestErrorMessage,
  internalServerErrorMessage,
  conflictErrorMessage,
  invalidCredentialsErrorMessage,
  notFoundUserErrorMessage,
  logoutMessage,
  validationErrorName,
  castErrorName,
} = require('../utils/constants');

const createUser = async (req, res, next) => {
  try {
    const {
      email,
      password,
      name,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });

    return res.send(user);
  } catch (e) {
    if (e.code === 11000) {
      return next(new ConflictError(conflictErrorMessage));
    }
    if (e.name === validationErrorName) {
      return next(new BadRequestError(badRequestErrorMessage));
    } return next(new InternalServerError(internalServerErrorMessage));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new UnauthorizedError(invalidCredentialsErrorMessage));
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return next(new UnauthorizedError(invalidCredentialsErrorMessage));
    }

    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV, { expiresIn: 3600 });
    res.cookie('jwt', token, { httpOnly: true, sameSite: true });

    return res.send(token);
  } catch (e) {
    if (e.name === validationErrorName) {
      return next(new BadRequestError(badRequestErrorMessage));
    } return next(new InternalServerError(internalServerErrorMessage));
  }
};

const logout = (req, res) => {
  res.clearCookie('jwt').send({ message: logoutMessage });
};

const getUserInfo = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return next(new NotFoundError(notFoundUserErrorMessage));
    }
    return res.send(user);
  } catch (e) {
    if (e.name === castErrorName) {
      return next(new BadRequestError(badRequestErrorMessage));
    } return next(new InternalServerError(internalServerErrorMessage));
  }
};

const editUseInfo = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { email, name } = req.body;
    const userEdited = await User.findByIdAndUpdate(
      userId,
      { email, name },
      { new: true, runValidators: true },
    );
    if (!userEdited) {
      return next(new NotFoundError(notFoundUserErrorMessage));
    }
    return res.send(userEdited);
  } catch (e) {
    if (e.code === 11000) {
      return next(new ConflictError(conflictErrorMessage));
    }
    if (e.name === validationErrorName) {
      return next(new BadRequestError(badRequestErrorMessage));
    } return next(new InternalServerError(internalServerErrorMessage));
  }
};

module.exports = {
  createUser,
  login,
  logout,
  getUserInfo,
  editUseInfo,
};
