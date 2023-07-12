const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');
const { INCORRECT_ADD_CARD_DATA_MESSAGE, URL_REGEX, INVALID_AUTH_DATA_ERROR_MESSAGE } = require('../utils/constants');
const UnauthorizedError = require('../errors/UnauthorizedError');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url) => URL_REGEX.test(url),
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => isEmail(value),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

const checkData = (data) => {
  if (!data) throw new UnauthorizedError(INVALID_AUTH_DATA_ERROR_MESSAGE);
};

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  const User = this;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      checkData(user);

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          checkData(matched);
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
