const { ERROR_401 } = require('../utils/constants');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_401;
  }
}

module.exports = UnauthorizedError;
