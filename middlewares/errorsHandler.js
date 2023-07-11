const { INTERNAL_SERVER_ERROR, SERVER_ERROR_MESSAGE } = require('../utils/constants');

const errorsHandler = ((err, req, res, next) => {
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === INTERNAL_SERVER_ERROR
        ? SERVER_ERROR_MESSAGE
        : message,
    });

  next();
});

module.exports = errorsHandler;
