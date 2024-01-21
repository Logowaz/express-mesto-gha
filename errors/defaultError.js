const { defaultError } = require('./errors');

class DefaultError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = defaultError;
  }
}

module.exports = DefaultError;
