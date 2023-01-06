const winston = require('winston'); // Библиотека для логирования
const expressWinston = require('express-winston');
// Логгер запросов
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
  ], // Transports отвечает за то куда писать лог - файл request
  format: winston.format.json(), // Отвечает за формат записи логов. У нас json
});
// Логгер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
