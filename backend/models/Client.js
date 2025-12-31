const db = require("../config/database_manager");

/**
 * Model Client - Simplifié pour correspondre aux fonctions disponibles
 * Utilise UNIQUEMENT les fonctions existantes dans database_manager.js
 */
const Client = {
  /**
   * Connexion d'un client
   * @param {string} email - Email du client
   * @param {string} password - Mot de passe du client
   * @returns {Promise<Object|undefined>} - Informations du client ou undefined si non trouvé
   */
  login: async (email, password) => {
    try {
      const client = await db.login(email, password);
      return client; // Retourne undefined si non trouvé
    } catch (error) {
      throw new Error(`Erreur lors de la connexion: ${error.message}`);
    }
  },

  /**
   * Obtenir les médicaments d'un client (via Medicament model)
   * Cette fonction est un raccourci vers le model Medicament
   * @param {number} id_client - ID du client
   * @returns {Promise<Array>} - Liste des médicaments
   */
  getMedicaments: async (id_client) => {
    try {
      return await db.getMedicaments(id_client);
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des médicaments: ${error.message}`
      );
    }
  },

  /**
   * Obtenir le planning d'un client (via Planning model)
   * Cette fonction est un raccourci vers le model Planning
   * @param {number} id_client - ID du client
   * @returns {Promise<Array>} - Liste des plannings
   */
  getPlanning: async (id_client) => {
    try {
      return await db.getPlanning(id_client);
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération du planning: ${error.message}`
      );
    }
  },

  /**
   * Obtenir l'historique d'un client (via Historique model)
   * Cette fonction est un raccourci vers le model Historique
   * @param {number} id_client - ID du client
   * @returns {Promise<Array>} - Liste de l'historique
   */
  getHistorique: async (id_client) => {
    try {
      return await db.getHistorique(id_client);
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de l'historique: ${error.message}`
      );
    }
  },

  /**
   * Calculer les statistiques de performance d'un client
   * Basé sur l'historique de ses prises
   * @param {number} id_client - ID du client
   * @returns {Promise<Object>} - Statistiques de performance
   */
  getPerformance: async (id_client) => {
    try {
      // Récupérer l'historique du client
      const historiques = await db.getHistorique(id_client);

      if (historiques.length === 0) {
        return {
          id_client,
          totalPrises: 0,
          prises: 0,
          oublis: 0,
          enRetard: 0,
          tauxObservance: 0,
          message: "Aucune donnée d'historique disponible",
        };
      }

      // Calculer les statistiques
      const prises = historiques.filter((h) => h.statut === "pris").length;
      const oublis = historiques.filter((h) => h.statut === "oublie").length;
      const enRetard = historiques.filter(
        (h) => h.statut === "en-retard"
      ).length;
      const totalPrises = historiques.length;
      const tauxObservance =
        totalPrises > 0 ? ((prises / totalPrises) * 100).toFixed(1) : 0;

      return {
        id_client,
        totalPrises,
        prises,
        oublis,
        enRetard,
        tauxObservance: parseFloat(tauxObservance),
      };
    } catch (error) {
      throw new Error(
        `Erreur lors du calcul de la performance: ${error.message}`
      );
    }
  },
};

module.exports = Client;
