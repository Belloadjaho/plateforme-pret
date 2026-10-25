const pool = require('../config/db');

exports.getRemboursements = async (req, res) => {
  try {
    let query = `SELECT r.*, c.emprunteur_id, u.nom, u.prenom
                 FROM remboursements r
                 JOIN contrats c ON c.id = r.contrat_id
                 JOIN users u ON u.id = c.emprunteur_id`;
    const params = [];

    if (req.user.role !== 'admin') {
      query += ' WHERE c.emprunteur_id = ?';
      params.push(req.user.id);
    }
    query += ' ORDER BY r.date_echeance ASC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getRemboursementsByContrat = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM remboursements WHERE contrat_id=? ORDER BY numero_echeance ASC',
      [req.params.contratId]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// 👇 Nouvelle fonction pour valider un paiement
exports.validerPaiement = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });
    
    const { id } = req.params;

    await pool.query(
      `UPDATE remboursements SET statut = 'paye', montant_paye = montant_du, date_paiement = NOW() WHERE id = ?`,
      [id]
    );

    res.json({ message: 'Paiement validé avec succès' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};