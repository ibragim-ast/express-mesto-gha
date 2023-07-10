const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const { INVALID_AUTH_DATA_ERROR_MESSAGE, URL_REGEX } = require('../utils/constants');
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
      message: 'Некорректная электронная почта',
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

userSchema.statics.findUserByCredentials = async function checkUserData(email, password) {
  const user = await this.findOne({ email }).select('+password');
  checkData(user);

  const matched = await bcrypt.compare(password, user.password);
  checkData(matched);

  return user;
};

module.exports = mongoose.model('user', userSchema);
