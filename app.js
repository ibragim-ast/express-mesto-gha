const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { PORT, DB_URI } = require('./config');
const errorsHandler = require('./middlewares/errorsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');

const allowedCors = [
  'http://ibragimast.nomoredomains.xyz',
  'https://ibragimast.nomoredomains.xyz',
  'localhost:3000',
  'http://localhost',
  'http://localhost:3001',
  'http://localhost:3000',
];

const corsOptions = {
  origin: allowedCors,
  optionsSuccessStatus: 200,
  credentials: true,
};

// Подключение к базе данных MongoDB
mongoose.connect(DB_URI)
  .then(() => {
    console.log('База данных в нашем распоряжении, Милорд');
  })
  .catch((error) => {
    console.log('Тут какая-то ошибка:', error);
    process.exit(1);
  });

const app = express();

// Использование middleware Helmet для обеспечения безопасности приложения
app.use(helmet());

// Middleware для обработки данных из тела запроса в формате URL-encoded и JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware для ограничения количества запросов от одного IP
// app.use(rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 минут
//   max: 100, // максимальное количество запросов
//   message: 'Слишком много запросов с вашего IP, попробуйте позже',
// }));

app.use(requestLogger);

app.use(cors(corsOptions));

// Подключение маршрутизатора
app.use(router);

// Middleware для обработки ошибок Celebrate
app.use(errors());

app.use(errorLogger);

// Middleware для обработки ошибок
app.use(errorsHandler);

// Запуск сервера на указанном порту
app.listen(PORT, () => {
  console.log('Сервер успешно запущен, Милорд');
});
