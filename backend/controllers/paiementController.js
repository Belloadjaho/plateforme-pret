const pool = require('../config/db');

exports.createPaiement = async (req, res) => {
  try {
    const { remboursement_id, contrat_id, montant, moyen_paiement, reference, preuve_url } = req.body;

    const [result] = await pool.query(
      `INSERT INTO paiements (remboursement_id, contrat_id, emprunteur_id, montant, moyen_paiement, reference, preuve_url, statut)
       VALUES (?,?,?,?,?,?,?,'en_attente')`,
      [remboursement_id, contrat_id, req.user.id, montant, moyen_paiement, reference || null, preuve_url || null]
    );

    res.status(201).json({ id: result.insertId, statut: 'en_attente' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getPaiements = async (req, res) => {
  try {
    let query = `SELECT p.*, u.nom, u.prenom
                 FROM paiements p JOIN users u ON u.id = p.emprunteur_id`;
    const params = [];

    if (req.user.role !== 'admin') {
      query += ' WHERE p.emprunteur_id = ?';
      params.push(req.user.id);
    }
    query += ' ORDER BY p.created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Admin valide ou rejette un paiement
exports.validatePaiement = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });
    const { statut } = req.body;
    if (!['valide', 'rejete'].includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    const [paiement] = await pool.query('SELECT * FROM paiements WHERE id=?', [req.params.id]);
    if (!paiement.length) return res.status(404).json({ message: 'Paiement introuvable' });

    await pool.query('UPDATE paiements SET statut=? WHERE id=?', [statut, req.params.id]);

    if (statut === 'valide') {
      const p = paiement[0];
      await pool.query(
        `UPDATE remboursements SET montant_paye = montant_paye + ?, date_paiement=NOW(),
         statut = IF(montant_du <= montant_paye + ?, 'paye', 'partiel')
         WHERE id=?`,
        [p.montant, p.montant, p.remboursement_id]
      );
    }

    res.json({ message: 'Paiement traité', statut });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};