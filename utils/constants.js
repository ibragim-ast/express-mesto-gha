const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]+\.[a-zA-Z0-9()]+\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;
const BAD_REQUEST_ERROR = 400;
const UNAUTHORIZED_ERROR = 401;
const ERROR_404 = 404;
const INTERNAL_SERVER_ERROR = 500;
const SERVER_ERROR_MESSAGE = 'Ошибка сервера';
const USER_NOT_FOUND_MESSAGE = 'Пользователь с указанным _id не найден';
const INCORRECT_USER_DATA_MESSAGE = 'Переданы некорректные данные пользователя';

module.exports = {
  BAD_REQUEST_ERROR,
  UNAUTHORIZED_ERROR,
  ERROR_404,
  INTERNAL_SERVER_ERROR,
  SERVER_ERROR_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
  INCORRECT_USER_DATA_MESSAGE,
  URL_REGEX,
};
