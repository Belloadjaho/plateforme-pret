const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { createPaiement, getPaiements, validatePaiement } = require('../controllers/paiementController');
router.get('/', auth, getPaiements);
router.post('/', auth, createPaiement);
router.put('/:id/validate', auth, validatePaiement);
module.exports = router;