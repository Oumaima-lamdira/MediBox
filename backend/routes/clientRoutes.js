const express = require("express");
const router = express.Router();
const Client = require("../models/Client");

// GET tous les clients (limité - fonctionnalité de base)
router.get("/", async (req, res) => {
  try {
    // Note: database_manager n'a pas de fonction obtenirClients
    // Cette route est limitée pour la compatibilité
    res.json({ 
      message: "Fonctionnalité limitée - utilisez l'authentification par email",
      available: ["POST /login", "GET /:id"]
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// POST login d'un client
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email et mot de passe sont requis",
      });
    }

    const client = await Client.login(email, password);

    if (!client) {
      return res.status(401).json({ message: "Authentification échouée" });
    }

    res.json({
      success: true,
      client: {
        id_client: client.id_client,
        nom: client.nom,
        email: client.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// GET un client par ID avec ses données
router.get("/:id", async (req, res) => {
  try {
    const clientId = req.params.id;

    // Récupérer les médicaments du client
    const medicaments = await Client.getMedicaments(clientId);
    
    // Récupérer le planning du client
    const plannings = await Client.getPlanning(clientId);
    
    // Récupérer l'historique du client
    const historique = await Client.getHistorique(clientId);
    
    // Récupérer les performances
    const performance = await Client.getPerformance(clientId);

    res.json({
      id_client: clientId,
      medicaments,
      plannings,
      historique,
      performance,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// GET performance globale d'un client
router.get("/:id/performance-globale", async (req, res) => {
  try {
    const performance = await Client.getPerformance(req.params.id);
    res.json(performance);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du calcul de la performance globale",
      error: error.message,
    });
  }
});

module.exports = router;
