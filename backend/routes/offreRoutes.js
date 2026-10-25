const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { createOffre, getOffres, getOffreById, toggleOffre, getOffreActive } = require('../controllers/offrePretController');

// 1. LA ROUTE SPÉCIFIQUE DOIT ÊTRE EN PREMIER
router.get('/active', auth, getOffreActive);

// 2. ENSUITE LES AUTRES ROUTES
router.get('/', auth, getOffres);
router.post('/', auth, createOffre);
router.put('/:id/toggle', auth, toggleOffre);

// 3. LA ROUTE AVEC PARAMÈTRE DOIT ÊTRE À LA FIN
router.get('/:id', auth, getOffreById);

module.exports = router;