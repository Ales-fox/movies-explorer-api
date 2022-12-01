const { errorMessage } = require('../constants');

const centralError = (err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? errorMessage.serverError
      : message,
  });
  next();
};

module.exports = centralError;
