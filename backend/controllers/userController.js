const pool = require('../config/db');

exports.getMe = async (req, res) => {
  try {
    // 👇 J'ai enlevé "date_naissance" de cette requête
    const [rows] = await pool.query(
      `SELECT id, nom, prenom, email, telephone, role, pays, ville, kyc_verifie, statut, created_at
       FROM users WHERE id=?`,
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Mettre à jour le profil
exports.updateMe = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, pays, ville } = req.body;
    
    await pool.query(
      `UPDATE users 
       SET nom=?, prenom=?, email=?, telephone=?, pays=?, ville=? 
       WHERE id=?`,
      [nom, prenom, email, telephone, pays, ville, req.user.id]
    );

    const [rows] = await pool.query(
      `SELECT id, nom, prenom, email, telephone, role, pays, ville FROM users WHERE id=?`,
      [req.user.id]
    );

    res.json({ message: 'Profil mis à jour', user: rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Liste tous les utilisateurs (admin seulement)
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });
    
    const [rows] = await pool.query(
      `SELECT id, nom, prenom, email, telephone, role, pays, ville, statut, created_at
       FROM users ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Bloquer / Débloquer un utilisateur
exports.toggleStatutUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });
    const { id } = req.params;
    const { statut } = req.body;

    if (!['actif', 'suspendu'].includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    await pool.query('UPDATE users SET statut=? WHERE id=?', [statut, id]);
    res.json({ message: `Utilisateur ${statut === 'actif' ? 'débloqué' : 'bloqué'}` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });
    const { id } = req.params;

    // On empêche l'admin de se supprimer lui-même
    if (Number(id) === req.user.id) {
      return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    await pool.query('DELETE FROM users WHERE id=?', [id]);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};