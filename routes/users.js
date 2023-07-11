const router = require('express').Router();

const {
  createUser,
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
  login,
} = require('../controllers/users');

router.post('/signup', createUser);
router.post('/signin', login);
router.get('/', getUsers);
router.get('/:id', getUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
