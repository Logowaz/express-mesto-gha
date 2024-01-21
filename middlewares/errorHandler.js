const { defaultError } = require('../errors/errors');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || defaultError;
  const message = statusCode === defaultError ? 'Произошла ошибка на сервере' : err.message;
  res.status(statusCode).send({ message });

  next();
};

module.exports = errorHandler;
