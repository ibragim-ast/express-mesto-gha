const router = require('express').Router();

const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/me', getUserInfo);
router.get('/', getUsers);
router.get('/:id', getUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
