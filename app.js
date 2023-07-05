const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {
  login,
  createUser,
} = require('./controllers/users');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());

const { ERROR_CODE_NOT_FOUND } = require('./utils/constants');

app.use((req, res, next) => {
  req.user = {
    _id: '64998afeb03e1c77a35f40aa',
  };

  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Слишком много запросов с вашего IP, попробуйте позже',
});

const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');

app.use(helmet());
app.use(limiter);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('/*', (req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запись не найдена!' });
});

app.post('/signin', login);
app.post('/signup', createUser);

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
