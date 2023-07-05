const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  ERROR_CODE_INVALID_DATA,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
  defaultErrorMessage,
} = require('../utils/constants');

const createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ERROR_CODE_INVALID_DATA).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

const login = (req, res) => {
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
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
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
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
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
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
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
};
