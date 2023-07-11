const jwt = require('jsonwebtoken');

const { UNAUTHORIZED_ERROR } = require('../utils/constants');

const handleAuthError = (res) => {
  res
    .status(UNAUTHORIZED_ERROR)
    .send({ message: 'Ошибка авторизации' });
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
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

  next();
};
