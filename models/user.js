/* eslint-disable func-names */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const AuthError = require('../errors/authError');

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
    validate: {
      validator: (v) => validator.isURL(v, { require_protocol: true, require_valid_protocol: true, protocols: ['http', 'htpps'] }),
      message: 'Некорректная ссылка',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректная электронная почта',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
}, { versionKey: false });

const findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль');
          }
          return user;
        });
    });
};

userSchema.statics.findUserByCredentials = findUserByCredentials;

module.exports = mongoose.model('User', userSchema);
