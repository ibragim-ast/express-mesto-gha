const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Error: { ValidationError, CastError } } = require('mongoose');
const User = require('../models/user');

const {
  USER_NOT_FOUND_MESSAGE,
  INCORRECT_USER_DATA_MESSAGE,
  INCORRECT_UPDATE_USER_DATA_MESSAGE,
  INCORRECT_ADD_USER_DATA_MESSAGE,
  NOT_UNIQUE_EMAIL_ERROR_MESSAGE,
  INCORRECT_UPDATE_AVATAR_DATA_MESSAGE,
} = require('../utils/constants');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictingRequestError = require('../errors/ConflictingRequestError');

// Функция проверки наличия данных
const checkData = (data) => {
  if (!data) throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
};

// Функция обработки ошибки получения пользователя
const handleGetUserError = (next, error) => {
  if (error instanceof CastError) {
    return next(new BadRequestError(INCORRECT_USER_DATA_MESSAGE));
  }
  return next(error);
};

// Функция поиска пользователя по ID
const findUser = (res, next, userId) => {
  User.findById(userId)
    .then((user) => {
      checkData(user);
      return res.send(user);
    })
    .catch((error) => {
      handleGetUserError(next, error);
    });
};

// Функция обработки ошибки обновления пользователя
const handleUpdateUserError = (next, error, avatar) => {
  if (error instanceof ValidationError) {
    return next(BadRequestError(
      !avatar
        ? INCORRECT_UPDATE_USER_DATA_MESSAGE
        : INCORRECT_UPDATE_AVATAR_DATA_MESSAGE,
    ));
  }
  return next(error);
};

// Функция обновления информации о пользователе
const UpdateUserData = (req, res, next, data) => {
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, data, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      checkData(user);
      return res.send(user);
    })
    .catch((error) => handleUpdateUserError(next, error, data.avatar));
};

// Создание нового пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((createdUser) => {
      const user = createdUser.toObject();
      delete user.password;
      return res
        .status(201)
        .send(user);
    })
    .catch((error) => {
      if (error.code === 11000) {
        return next(new ConflictingRequestError(NOT_UNIQUE_EMAIL_ERROR_MESSAGE));
      }
      if (error instanceof ValidationError) {
        return next(new BadRequestError(INCORRECT_ADD_USER_DATA_MESSAGE));
      }
      return next(error);
    });
};

// Аутентификация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'very-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

// Получение информации о всех пользователях
module.exports.getAllUsersInfo = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// Получение информации о пользователе по ID
module.exports.getUserInfoById = (req, res, next) => findUser(res, next, req.params.userId);

// Получение информации о текущем пользователе
module.exports.getCurrentUser = (req, res, next) => findUser(res, next, req.user._id);

// Обновление информации о пользователе
module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  return UpdateUserData(req, res, next, { name, about });
};

// Обновление аватара пользователя
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return UpdateUserData(req, res, next, { avatar });
};
