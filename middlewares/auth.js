const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { UNAUTHORIZED_ERROR_MESSAGE } = require('../utils/constants');

// Функция обработки ошибки авторизации
const handleAuthError = () => {
  throw new UnauthorizedError(UNAUTHORIZED_ERROR_MESSAGE);
};

// Функция извлечения токена из заголовка
const extractBearerToken = (header) => header.replace('Bearer ', '');

// Middleware для проверки авторизации
module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'very-secret-key');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  return next();
};
