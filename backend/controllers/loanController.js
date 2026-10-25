const pool = require('../config/db');

exports.createLoan = async (req, res) => {
  try {
    const { montant, taux, duree_mois, description } = req.body;
    const [result] = await pool.query(
      'INSERT INTO loans (emprunteur_id, montant, taux, duree_mois, description, statut) VALUES (?,?,?,?,?,?)',
      [req.user.id, montant, taux, duree_mois, description, 'en_attente']
    );
    res.status(201).json({ id: result.insertId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getLoans = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT l.*, u.nom AS emprunteur
      FROM loans l JOIN users u ON u.id = l.emprunteur_id
      ORDER BY l.created_at DESC
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getLoanById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM loans WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Prêt introuvable' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};