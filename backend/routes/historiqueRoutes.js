const express = require("express");
const router = express.Router();
const Historique = require("../models/Historique");

// GET historique des prises d'un client
router.get("/", async (req, res) => {
  try {
    const { clientId, statut, periode, limite } = req.query;

    if (!clientId) {
      return res.status(400).json({
        message: "L'ID du client est requis",
      });
    }

    let historiques;
    
    // Filtrage par statut
    if (statut) {
      historiques = await Historique.getByStatus(clientId, statut);
    } else if (periode) {
      const stats = await Historique.getStats(clientId, periode);
      return res.json(stats);
    } else if (limite) {
      historiques = await Historique.getRecent(clientId, parseInt(limite));
    } else {
      historiques = await Historique.getAll(clientId);
    }

    // Formater les données pour l'affichage
    const result = historiques.map((h) => {
      const date = new Date(h.date_reelle);

      return {
        id: h.id_historique,
        date: date.toLocaleDateString("fr-FR"),
        time: date.toLocaleTimeString("fr-FR"),
        medicine: h.nom_medoc || "N/A",
        statut: h.statut,
        alert:
          h.statut === "oublie"
            ? "critique"
            : h.statut === "en-retard"
            ? "retard"
            : null,
        planned_time: h.heure_prevue,
        actual_time: h.date_reelle,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// GET statistiques de l'historique
router.get("/stats", async (req, res) => {
  try {
    const { clientId, periode } = req.query;

    if (!clientId) {
      return res.status(400).json({
        message: "L'ID du client est requis",
      });
    }

    const stats = await Historique.getStats(clientId, periode || "all");
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// GET historique par médicament
router.get("/medicament/:nom_medoc", async (req, res) => {
  try {
    const { clientId } = req.query;

    if (!clientId) {
      return res.status(400).json({
        message: "L'ID du client est requis",
      });
    }

    const historiques = await Historique.getByMedicament(clientId, req.params.nom_medoc);
    
    const result = historiques.map((h) => {
      const date = new Date(h.date_reelle);
      return {
        id: h.id_historique,
        date: date.toLocaleDateString("fr-FR"),
        time: date.toLocaleTimeString("fr-FR"),
        medicine: h.nom_medoc,
        statut: h.statut,
        planned_time: h.heure_prevue,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// POST valider une prise avec statut personnalisé
router.post("/validate/:id", async (req, res) => {
  try {
    const { statut } = req.body;
    
    if (!statut) {
      return res.status(400).json({
        message: "Le statut est requis (pris, oublie, en-retard)",
      });
    }

    const success = await Historique.validate(req.params.id, statut);
    
    if (success) {
      res.json({ 
        success: true,
        message: `Prise marquée comme "${statut}" avec succès`
      });
    } else {
      res.status(400).json({ 
        success: false,
        message: "Échec de la validation de la prise"
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// POST marquer une prise comme prise
router.post("/marquer-prise/:id", async (req, res) => {
  try {
    const success = await Historique.markTaken(req.params.id);
    
    if (success) {
      res.json({ 
        success: true,
        message: "Prise marquée comme 'pris' avec succès"
      });
    } else {
      res.status(400).json({ 
        success: false,
        message: "Échec du marquage de la prise"
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// POST marquer une prise comme oubliée
router.post("/marquer-oubli/:id", async (req, res) => {
  try {
    const success = await Historique.markMissed(req.params.id);
    
    if (success) {
      res.json({ 
        success: true,
        message: "Prise marquée comme 'oubliée' aec succès"
      });
    } else {
      res.status(400).json({ 
        success: fase,
        message: "Échec du marquage e l'oubli"
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.messge });
  }
});

module.exports = router;
