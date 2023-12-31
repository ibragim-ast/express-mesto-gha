const { ERROR_400 } = require('../utils/constants');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_400;
  }
}

module.exports = BadRequestError;
