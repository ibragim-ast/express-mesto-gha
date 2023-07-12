const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { PORT, DB_URI } = require('./config');
const errorsHandler = require('./middlewares/errorsHandler');
const router = require('./routes');

// Подключение к базе данных MongoDB
mongoose.connect(DB_URI)
  .then(() => {
    console.log('Успешное подключение к базе данных');
  })
  .catch((error) => {
    console.log('Ошибка подключения к базе данных:', error);
    process.exit(1);
  });

const app = express();

// Использование middleware Helmet для обеспечения безопасности приложения
app.use(helmet());

// Middleware для обработки данных из тела запроса в формате URL-encoded и JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Подключение маршрутизатора
app.use(router);

// Middleware для ограничения количества запросов от одного IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимальное количество запросов
  message: 'Слишком много запросов с вашего IP, попробуйте позже',
}));

// Middleware для обработки ошибок Celebrate
app.use(errors());

// Middleware для обработки ошибок
app.use(errorsHandler);

// Запуск сервера на указанном порту
app.listen(PORT, () => {
  console.log('Сервер успешно запущен, Милорд');
});
