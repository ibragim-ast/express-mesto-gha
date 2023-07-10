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
const ConflictRequestError = require('../errors/ConflictingRequestError');
const { NODE_ENV, JWT_SECRET } = require('../config');
const { errors } = require('celebrate');

const checkData = (data) => {
  if (!data) throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return next(error);
  }
};

const handleGetUserError = (next, error) => {
  if (error instanceof CastError) {
    return next(new BadRequestError(INCORRECT_USER_DATA_MESSAGE));
  }
  return next(error);
};

const findUserById = async (res, next, userId) => {
  try {
    const user = await User.findById(userId);
    checkData(user);
    return res.send(user);
  } catch (error) {
    return handleGetUserError(next, error);
  }
};

module.exports.getUser = async (req, res, next) => {
  const { userId } = req.params;
  await findUserById(res, next, userId);
};

module.exports.getCurrentUser = async (req, res, next) => {
  const userId = req.user._id;
  await findUserById(res, next, userId);
};

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    let user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    user = user.toObject();
    delete user.password;
    return res.send(user);
  } catch (error) {
    if (error.code === 11000) {
      return next(new ConflictRequestError(NOT_UNIQUE_EMAIL_ERROR_MESSAGE));
    }
    if (error instanceof ValidationError) {
      return next(BadRequestError(INCORRECT_ADD_USER_DATA_MESSAGE));
    }
    return next(error);
  }
};

const handleUpdateUserError = (next, error, avatar) => {
  if (error instanceof ValidationError) {
    return next(new BadRequestError(
      !avatar
        ? INCORRECT_ADD_USER_DATA_MESSAGE
        : INCORRECT_UPDATE_AVATAR_DATA_MESSAGE,
    ));
  }
  return next(error);
};

const updateUserData = async (req, res, next, data) => {
  try {
    const { _id } = req.user;
    const user = await User.findByIdAndUpdate(_id, data, {
      new: true,
      runValidators: true,
    });
    checkData(user);
    return res.send(user);
  } catch (error) {
    return handleUpdateUserError(next, error, data.avatar);
  }
};

module.exports.updateUserInfo = async (req, res, next) => {
  const { name, about } = req.body;
  await updateUserData(req, res, next, { name, about });
};

module.exports.updateUserAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  await updateUserData(req, res, next, { avatar });
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { _id: userId } = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: userId },
      NODE_ENV === 'production' ? JWT_SECRET : 'very-secret-word',
      { expiresIn: '7d' },
    );
    return res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: true,
    })
      .send({ _id: userId });
  } catch (error) {
    return next(error);
  }
};
