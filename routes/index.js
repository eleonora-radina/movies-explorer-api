const router = require('express').Router();

const { createUser, login, logout } = require('../controllers/users');
const { signUpValidation, signInValidation } = require('../validation/validationUser');
const auth = require('../middlewares/auth');

const NotFoundError = require('../errors/NotFoundError');
const { notFoundErrorMessage } = require('../utils/constants');

router.post('/signup', signUpValidation, createUser);

router.post('/signin', signInValidation, login);

router.use(auth);

router.post('/signout', logout);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use((req, res, next) => {
  next(new NotFoundError(notFoundErrorMessage));
});

module.exports = router;
