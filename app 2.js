const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', require('./routes/index'));

app.use((req, res, next) => {
  req.user = {
    _id: '64998afeb03e1c77a35f40aa',
  };

  next();
});

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
