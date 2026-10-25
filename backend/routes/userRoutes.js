const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getMe, updateMe, getAllUsers, toggleStatutUser, deleteUser } = require('../controllers/userController');

router.get('/me', auth, getMe);
router.put('/me', auth, updateMe);

router.get('/', auth, getAllUsers);

// 👇 Nouvelles routes pour l'admin
router.put('/:id/statut', auth, toggleStatutUser);
router.delete('/:id', auth, deleteUser);

module.exports = router;