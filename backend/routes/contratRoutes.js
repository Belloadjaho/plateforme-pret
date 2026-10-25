const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { createContrat, getContrats, getContratById } = require('../controllers/contratController');
router.get('/', auth, getContrats);
router.get('/:id', auth, getContratById);
router.post('/', auth, createContrat);
module.exports = router;