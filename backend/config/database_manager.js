const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Connexion à la base de données
const dbPath = path.resolve(__dirname, "DBIOT.db");
const db = new sqlite3.Database(dbPath);

/**
 * 1. AUTHENTIFICATION
 * Pour la page de Login
 */
const login = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Client WHERE email = ? AND password = ?";
    db.get(sql, [email, password], (err, row) => {
      if (err) reject(err);
      resolve(row); // Retourne les infos du client ou undefined
    });
  });
};

/**
 * 2. GESTION DES MÉDICAMENTS
 * Pour afficher la liste et les stocks dans le profil
 */
const getMedicaments = (id_client) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Medicament WHERE id_client = ?";
    db.all(sql, [id_client], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

/**
 * 3. AJOUTER UN MÉDICAMENT
 * Pour le formulaire "Ajouter un médicament"
 */
const addMedicament = (id_client, nom, stock) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO Medicament (id_client, nom_medoc, stock_actuel) VALUES (?, ?, ?)";
    db.run(sql, [id_client, nom, stock], function (err) {
      if (err) reject(err);
      resolve({ id: this.lastID });
    });
  });
};

/**
 * 4. PLANNING (ALARMES)
 * Pour afficher les heures de rappel programmées
 */
const getPlanning = (id_client) => {
  return new Promise((resolve, reject) => {
    const sql = `
            SELECT p.*, m.nom_medoc
            FROM Planning p
            JOIN Medicament m ON p.id_medoc = m.id_medoc
            WHERE m.id_client = ?`;
    db.all(sql, [id_client], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

/**
 * 5. ENREGISTRER UNE PRISE
 * Appelé quand on clique sur "Pris" ou via l'IoT
 * ✅ CORRECTION: Utilise date_reelle pour correspondre à la base de données
 */
const validerPrise = (id_planning, statut) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // ✅ Utilise date_reelle au lieu de date_heure_reelle
      const dateActuelle = new Date().toISOString();

      // Ajout historique avec date_reelle
      db.run(
        "INSERT INTO Historique (id_planning, statut, date_reelle) VALUES (?, ?, ?)",
        [id_planning, statut, dateActuelle],
        (err) => {
          if (err) {
            reject(err);
            return;
          }

          // Mise à jour auto du stock si PRIS
          if (statut === "pris") {
            // ✅ Correction: "pris" en minuscule pour correspondre au schema
            const sqlUpdate = `
              UPDATE Medicament SET stock_actuel = stock_actuel - 1
              WHERE id_medoc = (SELECT id_medoc FROM Planning WHERE id_planning = ?)`;
            db.run(sqlUpdate, [id_planning], (err) => {
              if (err) reject(err);
              else resolve(true);
            });
          } else {
            resolve(true);
          }
        }
      );
    });
  });
};

/**
 * 6. HISTORIQUE
 * Pour afficher le journal des prises (pris / oublie)
 */
const getHistorique = (id_client) => {
  return new Promise((resolve, reject) => {
    const sql = `
            SELECT h.*, m.nom_medoc, p.heure_prevue
            FROM Historique h
            JOIN Planning p ON h.id_planning = p.id_planning
            JOIN Medicament m ON p.id_medoc = m.id_medoc
            WHERE m.id_client = ?
            ORDER BY h.date_reelle DESC`;
    db.all(sql, [id_client], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

module.exports = {
  login,
  getMedicaments,
  addMedicament,
  getPlanning,
  validerPrise,
  getHistorique,
};
