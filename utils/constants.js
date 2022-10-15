const regex = /^http(s)?:\/\/.?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/;

const badRequestErrorMessage = 'Переданы некорректные данные';
const internalServerErrorMessage = 'Ошибка по умолчанию.';
const notFoundFilmErrorMessage = 'Фильм с указанным _id не найден.';
const forbiddenFilmErrorMessage = 'Нельзя удалить чужой фильм.';
const unauthorizedErrorMessage = 'Необходима авторизация.';
const invalidCredentialsErrorMessage = 'Неправильные почта или пароль.';
const conflictErrorMessage = 'Данный email уже существует.';
const notFoundUserErrorMessage = 'Пользователь по указанному _id не найден.';
const notFoundErrorMessage = 'Страница не найдена';

const logoutMessage = 'Вы вышли из профиля';

const validationErrorName = 'ValidationError';
const castErrorName = 'CastError';
const invalidUrlMessage = 'Введите правильную ссылку';
const invalidEmailMessage = 'Введите правильный email';

module.exports = {
  regex,
  badRequestErrorMessage,
  internalServerErrorMessage,
  notFoundFilmErrorMessage,
  forbiddenFilmErrorMessage,
  unauthorizedErrorMessage,
  conflictErrorMessage,
  invalidCredentialsErrorMessage,
  notFoundUserErrorMessage,
  logoutMessage,
  validationErrorName,
  castErrorName,
  invalidUrlMessage,
  invalidEmailMessage,
  notFoundErrorMessage,
};
