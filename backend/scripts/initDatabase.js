const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "../DBIOT.db");
const schemaPath = path.join(__dirname, "../config/schema.sql");

// Créer une nouvelle base
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Erreur de connexion:", err.message);
    process.exit(1);
  }
  console.log("✅ Connecté à la base de données");
});

// Lire et exécuter le schéma
const schema = fs.readFileSync(schemaPath, "utf8");

db.exec(schema, (err) => {
  if (err) {
    console.error("❌ Erreur lors de l'exécution du schéma:", err.message);
    process.exit(1);
  }

  console.log("✅ Schéma créé avec succès");

  // Créer des historiques de test pour les 7 derniers jours
  const createTestHistoriques = () => {
    const statuts = ["pris", "en-retard", "oublie"];
    const retards = [0, 5, 15, 30, 60];
    
    // Récupérer tous les plannings
    db.all("SELECT * FROM Planning", (err, plannings) => {
      if (err) {
        console.error("Erreur récupération plannings:", err.message);
        return;
      }

      // Pour chaque planning, créer des historiques pour les 7 derniers jours
      plannings.forEach(planning => {
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          date.setHours(9, 0, 0, 0);
          
          const statut = statuts[Math.floor(Math.random() * statuts.length)];
          const retard = statut === "pris" ? retards[Math.floor(Math.random() * retards.length)] : 0;
          const dateHeure = new Date(date);
          dateHeure.setHours(parseInt(planning.heure_prevue.split(":")[0]), parseInt(planning.heure_prevue.split(":")[1]), 0, 0);
          
          db.run(
            `INSERT OR IGNORE INTO Historique (id_planning, date_heure_reelle, statut, retard_minutes, created_at)
             VALUES (?, ?, ?, ?, ?)`,
            [planning.id_planning, dateHeure.toISOString(), statut, retard, dateHeure.toISOString()],
            (err) => {
              if (err && err.message.indexOf("UNIQUE constraint failed") === -1) {
                console.error("Erreur insertion historique:", err.message);
              }
            }
          );
        }
      });
    });
  };

  createTestHistoriques();

  // Vérifier les données
  setTimeout(() => {
    db.all("SELECT * FROM Client", (err, rows) => {
      if (err) {
        console.error("❌ Erreur:", err.message);
      } else {
        console.log(`\n📊 Clients dans la base: ${rows.length}`);
        rows.forEach((row) => {
          console.log(`   - ${row.nom}, ${row.age} ans`);
        });
      }
    });

    db.all("SELECT * FROM Medicament", (err, rows) => {
      if (err) {
        console.error("❌ Erreur:", err.message);
      } else {
        console.log(`\n💊 Médicaments dans la base: ${rows.length}`);
        rows.forEach((row) => {
          console.log(`   - ${row.nom_medoc} (Stock: ${row.stock_actuel})`);
        });
      }
    });

    db.all("SELECT * FROM Planning", (err, rows) => {
      if (err) {
        console.error("❌ Erreur:", err.message);
      } else {
        console.log(`\n📅 Plannings dans la base: ${rows.length}`);
        rows.forEach((row) => {
          console.log(`   - Planning ${row.id_planning} à ${row.heure_prevue}`);
        });
      }
    });

    db.all("SELECT COUNT(*) as count FROM Historique", (err, rows) => {
      if (err) {
        console.error("❌ Erreur:", err.message);
      } else {
        console.log(`\n📋 Historiques dans la base: ${rows[0].count}`);
      }

      // Fermer la connexion
      db.close((err) => {
        if (err) {
          console.error("❌ Erreur fermeture:", err.message);
        } else {
          console.log("\n✅ Base de données initialisée avec succès !");
          console.log(`📁 Fichier: ${dbPath}`);
        }
      });
    });
  }, 1000);
});
