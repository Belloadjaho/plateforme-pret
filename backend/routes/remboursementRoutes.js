const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getRemboursements, getRemboursementsByContrat } = require('../controllers/remboursementController');
router.get('/', auth, getRemboursements);
router.get('/contrat/:contratId', auth, getRemboursementsByContrat);
module.exports = router;