const mysql = require('mysql2/promise');
const fs = require('fs');

async function importDB() {
  try {
    // 1. Connexion à Aiven
    const connection = await mysql.createConnection({
      host: 'pretdirect-db-belloadjaho6213-ca23.k.aivencloud.com',
      port: 22162,
      user: 'avnadmin',
      password: 'AVNS_rZx_KnqHURcxCROQaQk',
      database: 'defaultdb',
      ssl: { rejectUnauthorized: false }, // On accepte le certificat auto-signé
      multipleStatements: true // Très important pour exécuter plusieurs requêtes d'un coup
    });

    console.log("✅ Connecté à Aiven !");
    await connection.query('SET SESSION sql_require_primary_key = 0;');

    // 2. Lire le fichier SQL
    const sql = fs.readFileSync('C:/Users/Bello Adjaho/Downloads/plateforme_pret.sql', 'utf8');

    // 3. Exécuter le SQL
    console.log("⏳ Importation en cours...");
    await connection.query(sql);
    
    console.log("🎉 Importation terminée avec succès !");
    await connection.end();

  } catch (err) {
    console.error("❌ Erreur lors de l'import :", err.message);
  }
}

importDB();