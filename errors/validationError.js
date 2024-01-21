const { validationError } = require('./errors');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = validationError;
  }
}

module.exports = ValidationError;
