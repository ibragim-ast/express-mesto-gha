const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Error: { ValidationError, CastError } } = require('mongoose');

const NOT_FOUND_ERROR = require('../errors/NotFoundError');
const User = require('../models/user');

const {
  BAD_REQUEST_ERROR,
  ERROR_404,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED_ERROR,
  SERVER_ERROR_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
} = require('../utils/constants');

const checkData = (data) => {
  if (!data) throw
}

module.exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => res
      .status(201)
      .send({
        _id: user._id,
        email: user.email,
      }))
    .catch((error) => res.status(BAD_REQUEST_ERROR).send(error));
};

module.exports.login = (req, res) => {
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
    .catch((err) => {
      res
        .status(UNAUTHORIZED_ERROR)
        .send({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send(SERVER_ERROR_MESSAGE));
};

module.exports.getUser = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        return res.status(ERROR_404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      if (error.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Передан некорректный id пользователя' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send(SERVER_ERROR_MESSAGE);
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        return res.status(ERROR_404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      if (error.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send(SERVER_ERROR_MESSAGE);
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        return res.status(ERROR_404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      if (error.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send(SERVER_ERROR_MESSAGE);
    });
};
