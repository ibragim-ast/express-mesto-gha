const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const cardsRouter = require('./cards');
const usersRouter = require('./users');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const { auth } = require('../middlewares/auth');
const { URL_REGEX } = require('../utils/constants');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(URL_REGEX),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

router.use('/users', auth, usersRouter);

router.use('/cards', auth, cardsRouter);

router.all('*', (req, res, next) => next(new NotFoundError('Неверный URL запроса')));

module.exports = router;
