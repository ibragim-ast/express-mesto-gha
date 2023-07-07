const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/notFoundError');
const RequestError = require('../errors/requestError');
const ConflictError = require('../errors/conflictError');

const {
  ERROR_CODE_INVALID_DATA,
  ERROR_CODE_DEFAULT,
  defaultErrorMessage,
} = require('../utils/constants');

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => {
      const noPasswordUser = user.toObject({ useProjection: true });
      return res.send(noPasswordUser);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new RequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (error.code === 11000) {
        return next(new ConflictError('Пользователь с указанным e-mail уже зарегистрирован.'));
      }
      return next(error);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign(
          { _id: user._id },
          'some-secret-key',
          { expiresIn: '7d' },
        ),
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ERROR_CODE_INVALID_DATA).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

const getUserInfo = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.send(user);
    })
    .catch(() => res
      .status(ERROR_CODE_DEFAULT)
      .send({ message: defaultErrorMessage }));
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage }));
};

const getUser = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      if (error.name === 'CastError') {
        return res.status(ERROR_CODE_INVALID_DATA).send({ message: 'Передан некорректный id пользователя' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      if (error.name === 'ValidationError') {
        return res.status(ERROR_CODE_INVALID_DATA).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      if (error.name === 'ValidationError') {
        return res.status(ERROR_CODE_INVALID_DATA).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
  login,
  getUserInfo,
};
