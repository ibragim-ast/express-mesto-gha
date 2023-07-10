const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/constants');
const { UNAUTHORIZED_ERROR_MESSAGE } = require('../utils/constants');
const { NODE_ENV, JWT_SECRET } = require('../config');

const handleAuthError = () => {
  throw new UnauthorizedError(UNAUTHORIZED_ERROR_MESSAGE);
};

module.exports.auth = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      handleAuthError();
    }

    let payload;
    try {
      payload = jwt.verify(
        token,
        NODE_ENV === 'production' ? JWT_SECRET : 'very-secret-word',
      );
    } catch (error) {
      handleAuthError();
    }
    req.user = payload;
    return next();
  } catch (error) {
    return next(error);
  }
};
