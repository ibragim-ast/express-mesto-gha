const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());

const { ERROR_CODE_NOT_FOUND } = require('./utils/constants');

const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('/*', (req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запись не найдена!' });
});

app.use((req, res, next) => {
  req.user = {
    _id: '64998afeb03e1c77a35f40aa',
  };

  next();
});

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
