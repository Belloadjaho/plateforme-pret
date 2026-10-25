const pool = require('../config/db');

// Admin crée un contrat à partir d'une demande acceptée
exports.createContrat = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });

    const { demande_id, montant_principal, duree_mois, taux_interet, numero_reception, pdf_url } = req.body;

    const [demande] = await pool.query('SELECT * FROM demandes_pret WHERE id=?', [demande_id]);
    if (!demande.length) return res.status(404).json({ message: 'Demande introuvable' });

    const d = demande[0];
    const interets_totaux = (montant_principal * taux_interet * duree_mois) / 100;
    const montant_total_du = parseFloat(montant_principal) + interets_totaux;
    const mensualite = montant_total_du / duree_mois;

    const [result] = await pool.query(
      `INSERT INTO contrats
       (demande_id, emprunteur_id, admin_id, montant_principal, duree_mois, taux_interet,
        interets_totaux, montant_total_du, mensualite, numero_reception, pdf_url, statut_whatsapp)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,'non_envoye')`,
      [demande_id, d.emprunteur_id, req.user.id, montant_principal, duree_mois, taux_interet,
       interets_totaux, montant_total_du, mensualite, numero_reception, pdf_url || null]
    );

    // Générer les échéances de remboursement
    const contratId = result.insertId;
    const today = new Date();
    for (let i = 1; i <= duree_mois; i++) {
      const dateEcheance = new Date(today);
      dateEcheance.setMonth(dateEcheance.getMonth() + i);
      await pool.query(
        `INSERT INTO remboursements (contrat_id, numero_echeance, date_echeance, montant_du, statut)
         VALUES (?,?,?,?, 'a_venir')`,
        [contratId, i, dateEcheance.toISOString().split('T')[0], mensualite]
      );
    }

    res.status(201).json({ id: contratId, mensualite, montant_total_du });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getContrats = async (req, res) => {
  try {
    let query = `SELECT c.*, u.nom, u.prenom, u.email
                 FROM contrats c JOIN users u ON u.id = c.emprunteur_id`;
    const params = [];

    if (req.user.role !== 'admin') {
      query += ' WHERE c.emprunteur_id = ?';
      params.push(req.user.id);
    }
    query += ' ORDER BY c.created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getContratById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, u.nom, u.prenom, u.email, u.telephone
       FROM contrats c JOIN users u ON u.id = c.emprunteur_id
       WHERE c.id=?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Contrat introuvable' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};