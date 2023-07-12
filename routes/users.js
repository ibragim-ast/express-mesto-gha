const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllUsersInfo,
  getUserInfoById,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');
const { URL_REGEX } = require('../utils/constants');

// Маршрут для получения информации о всех пользователях
router.get('/', getAllUsersInfo);

// Маршрут для получения информации о текущем пользователе
router.get('/me', getCurrentUser);

// Маршрут для получения информации о пользователе по его идентификатору
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUserInfoById);

// Маршрут для обновления информации о текущем пользователе
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUserInfo);

// Маршрут для обновления аватара текущего пользователя
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(URL_REGEX),
  }),
}), updateUserAvatar);

module.exports = router;
