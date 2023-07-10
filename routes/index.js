const router = require('express').Router();

const { errors } = require('celebrate');
const NotFoundError = require('../errors/NotFoundError');

const cardsRouter = require('./cards');
const usersRouter = require('./users');

const { login, createUser } = require('../controllers/users');
const { validateCreateUserRequest, validateLoginRequest } = require('../middlewares/requestValidation');

const auth = require('../middlewares/auth');

router.post('/signin', validateLoginRequest, login);
router.post('/signup', validateCreateUserRequest, createUser);

router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('/*', (req, res, next) => next(new NotFoundError('Запись не найдена.')));
router.use(errors({ message: 'Ошибка валидации данных!' }));

module.exports = router;
