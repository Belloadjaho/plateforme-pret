const pool = require('../config/db');

// Emprunteur crée une demande
exports.createDemande = async (req, res) => {
  try {
    const { offre_id, montant_demande, duree_mois, taux_applique, motif, numero_reception, type_reception } = req.body;

    if (!montant_demande || !duree_mois || !taux_applique || !numero_reception) {
      return res.status(400).json({ message: 'Champs obligatoires manquants' });
    }

    const [result] = await pool.query(
      `INSERT INTO demandes_pret
       (emprunteur_id, offre_id, montant_demande, duree_mois, taux_applique, motif, numero_reception, type_reception, statut)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [req.user.id, offre_id || null, montant_demande, duree_mois, taux_applique, motif || null, numero_reception, type_reception || 'mobile_money', 'en_attente']
    );

    res.status(201).json({ id: result.insertId, statut: 'en_attente' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Liste les demandes
exports.getDemandes = async (req, res) => {
  try {
    let query = `SELECT d.*, u.nom, u.prenom, u.email
                 FROM demandes_pret d JOIN users u ON u.id = d.emprunteur_id`;
    const params = [];

    if (req.user.role !== 'admin') {
      query += ' WHERE d.emprunteur_id = ?';
      params.push(req.user.id);
    }
    query += ' ORDER BY d.created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getDemandeById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT d.*, u.nom, u.prenom, u.email, u.telephone
       FROM demandes_pret d JOIN users u ON u.id = d.emprunteur_id
       WHERE d.id=?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Demande introuvable' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Admin accepte ou refuse
exports.updateDemandeStatut = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });
    const { statut, motif_refus } = req.body;
    if (!['acceptee', 'refusee', 'annulee'].includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    await pool.query(
      `UPDATE demandes_pret SET statut=?, motif_refus=?, date_traitement=NOW() WHERE id=?`,
      [statut, motif_refus || null, req.params.id]
    );

    if (statut === 'acceptee') {
      const [demandeRows] = await pool.query('SELECT * FROM demandes_pret WHERE id=?', [req.params.id]);
      const demande = demandeRows[0];

      if (demande) {
        const montant = parseFloat(demande.montant_demande);
        const taux = parseFloat(demande.taux_applique);
        const duree = parseInt(demande.duree_mois);
        
        const interetsTotal = (montant * (taux / 100) * (duree / 12));
        const totalDu = montant + interetsTotal;
        const mensualite = totalDu / duree;

        const [contratResult] = await pool.query(
          `INSERT INTO contrats 
           (demande_id, emprunteur_id, admin_id, montant_principal, duree_mois, taux_interet, 
            interets_totaux, montant_total_du, mensualite, numero_reception, statut_whatsapp)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'non_envoye')`,
          [
            demande.id, demande.emprunteur_id, req.user.id, montant, duree, taux, 
            interetsTotal, totalDu, mensualite, demande.numero_reception
          ]
        );

        const contratId = contratResult.insertId;
        let dateEcheance = new Date();
        
        for (let i = 1; i <= duree; i++) {
          dateEcheance.setMonth(dateEcheance.getMonth() + 1);
          await pool.query(
            `INSERT INTO remboursements (contrat_id, numero_echeance, date_echeance, montant_du, statut)
             VALUES (?, ?, ?, ?, 'a_venir')`,
            [contratId, i, dateEcheance.toISOString().split('T')[0], mensualite]
          );
        }
      }
    }

    res.json({ message: 'Statut mis à jour', statut });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Récupérer la dernière demande de l'utilisateur connecté
exports.getMaDemande = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM demandes_pret WHERE emprunteur_id = ? ORDER BY created_at DESC LIMIT 1`,
      [req.user.id]
    );
    if (!rows.length) return res.json({ statut: 'aucun' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Récupérer les échéances de l'emprunteur connecté
exports.getMesRemboursements = async (req, res) => {
  try {
    const [contratRows] = await pool.query(
      `SELECT id FROM contrats WHERE emprunteur_id = ? ORDER BY created_at DESC LIMIT 1`,
      [req.user.id]
    );
    if (!contratRows.length) return res.json([]);

    const contratId = contratRows[0].id;
    const [remboursements] = await pool.query(
      `SELECT * FROM remboursements WHERE contrat_id = ? ORDER BY numero_echeance ASC`,
      [contratId]
    );
    res.json(remboursements);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Récupérer les échéances via l'ID de la demande (pour l'admin)
exports.getEcheancesByDemandeId = async (req, res) => {
  try {
    const { id } = req.params;
    const [contratRows] = await pool.query('SELECT id FROM contrats WHERE demande_id = ?', [id]);
    if (!contratRows.length) return res.json([]); 

    const contratId = contratRows[0].id;
    const [remboursements] = await pool.query(
      'SELECT * FROM remboursements WHERE contrat_id = ? ORDER BY numero_echeance ASC',
      [contratId]
    );
    res.json(remboursements);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Récupérer les statistiques pour l'historique (Admin)
exports.getStatistiquesAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });

    // 1. Prêts remboursés (Contrats dont TOUTES les échéances sont payées)
    const [remboursesRows] = await pool.query(
      `SELECT COUNT(c.id) as total 
       FROM contrats c 
       WHERE (SELECT COUNT(*) FROM remboursements r WHERE r.contrat_id = c.id AND r.statut != 'paye') = 0`
    );
    
    // 2. Prêts en cours (Contrats qui ont au moins une échéance non payée)
    const [encoursRows] = await pool.query(
      `SELECT COUNT(DISTINCT c.id) as total 
       FROM contrats c 
       JOIN remboursements r ON r.contrat_id = c.id 
       WHERE r.statut != 'paye'`
    );

    // 3. Intérêts perçus (Calcul au prorata des échéances payées)
    const [interetsRows] = await pool.query(
      `SELECT SUM((c.interets_totaux / c.duree_mois) * (
          SELECT COUNT(*) FROM remboursements r WHERE r.contrat_id = c.id AND r.statut = 'paye'
       )) as total 
       FROM contrats c`
    );

    res.json({
      pretsRembourses: remboursesRows[0].total || 0,
      pretsEnCours: encoursRows[0].total || 0,
      interetsPercus: parseFloat(interetsRows[0].total) || 0
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};