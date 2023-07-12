const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { PORT, DB_URI } = require('./config');
const errorsHandler = require('./middlewares/errorsHandler');
const router = require('./routes');

mongoose.connect(DB_URI)
  .then(() => {
    console.log('Успешное подключение к базе данных');
  })
  .catch((error) => {
    console.log('Ошибка подключения к базе данных:', error);
    process.exit(1);
  });

const app = express();
app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Слишком много запросов с вашего IP, попробуйте позже',
}));

app.use(errors());

app.use(errorsHandler);

app.listen(PORT, () => {
  console.log('Сервер успешно запущен');
});
