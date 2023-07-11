const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Joi, celebrate, errors } = require('celebrate');
const { auth } = require('./middlewares/auth');
const { URL_REGEX } = require('./utils/constants');
const errorsHandler = require('./middlewares/errorsHandler');

const { ERROR_CODE_NOT_FOUND } = require('./utils/constants');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    console.log('Успешное подключение к базе данных');
  })
  .catch((error) => {
    console.log('Ошибка подключения к базе данных:', error);
    process.exit(1);
  });

app.use(bodyParser.json());

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Слишком много запросов с вашего IP, попробуйте позже',
}));



app.use('/*', (req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запись не найдена!' });
});

app.use(errors());

app.use(errorsHandler);

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
