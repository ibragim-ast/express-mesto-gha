const User = require('../models/user');

const {
  ERROR_CODE_INVALID_DATA,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
  defaultErrorMessage,
} = require('../utils/constants');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ERROR_CODE_INVALID_DATA).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      if (error.name === 'CastError') {
        return res.status(ERROR_CODE_INVALID_DATA).send({ message: 'Передан некорректный id пользователя.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

module.exports.updateProfile = (req, res) => {
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

module.exports.updateAvatar = (req, res) => {
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
