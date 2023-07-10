const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]+\.[a-zA-Z0-9()]+\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;
const ERROR_CODE_400 = 400;
const ERROR_CODE_403 = 403;
const ERROR_CODE_404 = 404;
const ERROR_CODE_409 = 409;
const ERROR_CODE_401 = 401;
const INVALID_AUTH_DATA_ERROR_MESSAGE = 'Неправильные почта или пароль';

module.exports = {
  URL_REGEX,
  ERROR_CODE_400,
  ERROR_CODE_403,
  ERROR_CODE_404,
  ERROR_CODE_409,
  ERROR_CODE_401,
  INVALID_AUTH_DATA_ERROR_MESSAGE,
};
