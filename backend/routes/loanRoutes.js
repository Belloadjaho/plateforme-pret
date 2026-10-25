const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { createLoan, getLoans, getLoanById } = require('../controllers/loanController');
router.get('/', auth, getLoans);
router.get('/:id', auth, getLoanById);
router.post('/', auth, createLoan);
module.exports = router;