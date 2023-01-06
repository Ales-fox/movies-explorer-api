const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser'); // Для чтения кук
const { errors } = require('celebrate');
require('dotenv').config();// Модуль для работы с переменной окружения process.env
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const centralError = require('./middlewares/centralError');
const { allowedCors } = require('./constants');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/moviesdb' } = process.env;
// Подключение базы данных
mongoose.connect(MONGO_URL);

const app = express();
app.use(cookieParser());
app.use(requestLogger); // Логгер запросов. Подключается до всех обработчиков роутов

// Подключаем возможность обработки json объектов запросами
// Всегда выше запросов где это используется
// Можно подключить только к 1 конкретному запросу
app.use(express.json());

app.use((req, res, next) => {
  const { origin } = req.headers; // Записываем в переменную origin соответствующий заголовок
  const { method } = req; // Сохраняем тип запроса

  const allowedMethods = 'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS';
  const requestHeaders = req.headers['access-control-request-headers'];

  // Проверяем, что значение origin есть среди разрешённых доменов
  if (allowedCors.includes(origin)) {
    // Устанавливаем заголовок, ктр разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', allowedMethods);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
});

app.use(router);

app.use(errorLogger); //  Логгер ошибок. Подключаем после обр-в роутов и до обр-в ошибок
app.use(errors()); // Обработчик ошибок celebrate
// Централизованный обработчик ошибок, находится ниже всех но до PORT
app.use(centralError);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
