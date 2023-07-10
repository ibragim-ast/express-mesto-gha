const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');
const { URL_REGEX } = require('../utils/constants');

router.get('/', getUsers);

router.get('/me', getUserInfo);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(URL_REGEX),
  }),
}), updateAvatar);

module.exports = router;
