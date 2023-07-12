const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]+\.[a-zA-Z0-9()]+\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;
const ERROR_400 = 400;
const ERROR_401 = 401;
const ERROR_403 = 403;
const ERROR_404 = 404;
const ERROR_409 = 409;
const INTERNAL_SERVER_ERROR = 500;
const SERVER_ERROR_MESSAGE = 'Ошибка сервера';
const USER_NOT_FOUND_MESSAGE = 'Пользователь с указанным _id не найден';
const INCORRECT_USER_DATA_MESSAGE = 'Переданы некорректные данные пользователя';
const UNAUTHORIZED_ERROR_MESSAGE = 'Необходима авторизация';
const CARD_NOT_FOUND_MESSAGE = 'Карточка с указанным _id не найдена';
const INCORRECT_ADD_CARD_DATA_MESSAGE = 'Переданы некорректные данные при создании карточки';
const INCORRECT_LIKE_CARD_DATA_MESSAGE = 'Переданы некорректные данные для постановки/снятии лайка';
const INCORRECT_CARD_DATA_MESSAGE = 'Переданы некорректные данные карточки';
const NO_RIGHTS_TO_DELETE_ERROR_MESSAGE = 'У вас недостаточно прав на удаление данной карточки';
const INCORRECT_UPDATE_USER_DATA_MESSAGE = ' Переданы некорректные данные при обновлении профиля';
const INCORRECT_ADD_USER_DATA_MESSAGE = 'Переданы некорректные данные при создании пользователя';
const NOT_UNIQUE_EMAIL_ERROR_MESSAGE = 'Пользователь с таким email уже зарегистрирован';
const INCORRECT_UPDATE_AVATAR_DATA_MESSAGE = 'Переданы некорректные данные при обновлении аватара';
const INVALID_AUTH_DATA_ERROR_MESSAGE = 'Неправильные почта или пароль';

module.exports = {
  ERROR_400,
  ERROR_401,
  ERROR_403,
  ERROR_404,
  ERROR_409,
  INTERNAL_SERVER_ERROR,
  SERVER_ERROR_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
  INCORRECT_USER_DATA_MESSAGE,
  URL_REGEX,
  CARD_NOT_FOUND_MESSAGE,
  INCORRECT_ADD_CARD_DATA_MESSAGE,
  INCORRECT_LIKE_CARD_DATA_MESSAGE,
  INCORRECT_CARD_DATA_MESSAGE,
  NO_RIGHTS_TO_DELETE_ERROR_MESSAGE,
  UNAUTHORIZED_ERROR_MESSAGE,
  INCORRECT_UPDATE_USER_DATA_MESSAGE,
  INCORRECT_ADD_USER_DATA_MESSAGE,
  NOT_UNIQUE_EMAIL_ERROR_MESSAGE,
  INCORRECT_UPDATE_AVATAR_DATA_MESSAGE,
  INVALID_AUTH_DATA_ERROR_MESSAGE,
};
