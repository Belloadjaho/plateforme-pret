const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, password, role, pays, ville } = req.body;

    if (!nom || !prenom || !email || !telephone || !password) {
      return res.status(400).json({ message: 'Champs obligatoires manquants (nom, prenom, email, telephone, password)' });
    }

    const [exists] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
    if (exists.length) return res.status(400).json({ message: 'Email déjà utilisé' });

    const hash = await bcrypt.hash(password, 10);
    
    // 👇 ON ENLÈVE date_naissance DE LA REQUÊTE SQL
    const [result] = await pool.query(
      `INSERT INTO users (nom, prenom, email, telephone, password_hash, role, pays, ville)
       VALUES (?,?,?,?,?,?,?,?)`,
      [nom, prenom, email, telephone, hash, role || 'emprunteur', pays || null, ville || null]
    );

    res.status(201).json({
      id: result.insertId,
      nom, prenom, email, telephone,
      role: role || 'emprunteur',
      statut: 'en_attente',
    });
  } catch (e) {
    console.error("Erreur d'inscription :", e); 
    res.status(500).json({ error: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
    if (!rows.length) return res.status(400).json({ message: 'Utilisateur introuvable' });

    const user = rows[0];
    if (user.statut === 'suspendu') return res.status(403).json({ message: 'Compte suspendu' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        role: user.role,
        statut: user.statut,
        kyc_verifie: user.kyc_verifie,
      },
    });
  } catch (e) {
    console.error("Erreur de connexion :", e);
    res.status(500).json({ error: e.message });
  }
};