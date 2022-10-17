const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { unauthorizedErrorMessage } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;
const { JWT_SECRET_DEV } = require('../utils/config');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
  } catch (e) {
    return next(new UnauthorizedError(unauthorizedErrorMessage));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
