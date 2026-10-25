const router = require('express').Router();
const auth = require('../middleware/authMiddleware');

const { createDemande, getDemandes, getDemandeById, updateDemandeStatut, getMaDemande, getMesRemboursements,getEcheancesByDemandeId,getStatistiquesAdmin } = require('../controllers/demandePretController');

const { getRemboursementsByContrat, validerPaiement } = require('../controllers/remboursementController');

// Routes spécifiques (avant /:id)
router.get('/ma-demande', auth, getMaDemande);
router.get('/mes-remboursements', auth, getMesRemboursements);
router.get('/admin/stats', auth, getStatistiquesAdmin); 
router.put('/remboursements/:id/valider', auth, validerPaiement);
router.get('/remboursements/contrat/:contratId', auth, getRemboursementsByContrat);
router.get('/:id/echeances', auth, getEcheancesByDemandeId);

// Routes standards
router.get('/', auth, getDemandes);
router.post('/', auth, createDemande);
router.put('/:id/statut', auth, updateDemandeStatut);

// Route avec paramètre (à la fin)
router.get('/:id', auth, getDemandeById);

module.exports = router;