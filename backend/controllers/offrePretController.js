const pool = require('../config/db');

// Admin crée une offre
exports.createOffre = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });
    const { titre, description, montant_min, montant_max, duree_min_mois, duree_max_mois, taux_interet, tranches } = req.body;

    const [result] = await pool.query(
      `INSERT INTO offres_pret
       (admin_id, titre, description, montant_min, montant_max, duree_min_mois, duree_max_mois, taux_interet, tranches, actif)
       VALUES (?,?,?,?,?,?,?,?,?,1)`,
      [
        req.user.id, 
        titre || 'Offre Standard', 
        description || null, 
        montant_min, 
        montant_max, 
        duree_min_mois, 
        duree_max_mois, 
        taux_interet || 5, 
        tranches ? JSON.stringify(tranches) : null
      ]
    );

    res.status(201).json({ id: result.insertId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Tout le monde peut voir les offres actives
exports.getOffres = async (req, res) => {
  try {
    let query = `SELECT o.*, u.nom AS admin_nom, u.prenom AS admin_prenom
                 FROM offres_pret o JOIN users u ON u.id = o.admin_id`;
    const params = [];

    if (req.user.role !== 'admin') {
      query += ' WHERE o.actif = 1';
    }
    query += ' ORDER BY o.created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getOffreById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM offres_pret WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Offre introuvable' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.toggleOffre = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });
    const { actif } = req.body;
    await pool.query('UPDATE offres_pret SET actif=? WHERE id=?', [actif ? 1 : 0, req.params.id]);
    res.json({ message: 'Offre mise à jour' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// 👇 Récupérer l'offre active (pour les emprunteurs)
exports.getOffreActive = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM offres_pret WHERE actif = 1 ORDER BY created_at DESC LIMIT 1`
    );
    
    if (!rows.length) {
      // Si aucune offre n'existe, on renvoie une offre par défaut avec des tranches
      return res.json({
        montant_min: 5000,
        montant_max: 500000,
        duree_min_mois: 3,
        duree_max_mois: 24,
        taux_interet: 5,
        whatsapp: '+22900000000',
        tranches: [
          { max: 30000, taux: 5 },
          { max: 50000, taux: 20 },
          { max: 500000, taux: 10 }
        ]
      });
    }
    
    const offre = rows[0];
    
    // On s'assure que les tranches sont bien renvoyées sous forme de tableau JSON
    if (offre.tranches && typeof offre.tranches === 'string') {
      offre.tranches = JSON.parse(offre.tranches);
    } else if (!offre.tranches) {
      offre.tranches = [];
    }

    res.json(offre);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};