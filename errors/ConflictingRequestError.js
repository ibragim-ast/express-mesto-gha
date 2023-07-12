const { ERROR_409 } = require('../utils/constants');

class ConflictingRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_409;
  }
}

module.exports = ConflictingRequestError;
