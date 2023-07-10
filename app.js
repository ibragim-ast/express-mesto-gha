const express = require('express');
const mongoose = require('mongoose');

const { PORT, DB_URI } = require('./config');

const app = express();

const errorHandler = require('./middlewares/errorHandler');

(async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log('Соединение с базой данных установлено');
  } catch (error) {
    console.log(`Ошибка соединения с базой данных ${error.message}`);
  }
})();

app.use(express.json());

mongoose.connect(DB_URI, {});

app.use('/', require('./routes/index'));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Приложение слушает порт ${PORT}`);
});
