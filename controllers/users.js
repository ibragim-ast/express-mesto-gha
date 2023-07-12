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

const checkData = (data) => {
  if (!data) throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
};

module.exports.getAllUsersInfo = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))

    .catch(next);
};

const handleGetUserError = (next, error) => {
  if (error instanceof CastError) {
    return next(new BadRequestError(INCORRECT_USER_DATA_MESSAGE));
  }
  return next(error);
};

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

module.exports.getUserInfoById = (req, res, next) => findUser(res, next, req.params.userId);

module.exports.getCurrentUser = (req, res, next) => findUser(res, next, req.user._id);

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

const UpdateUserData = (req, res, next, data) => {
  const { _id } = req.user;

  User.findByIdAndDelete(_id, data, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      checkData(user);
      return res.send(user);
    })
    .catch((error) => handleUpdateUserError(next, error, data.avatar));
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  return UpdateUserData(req, res, next, { name, about });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return UpdateUserData(req, res, next, { avatar });
};

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
