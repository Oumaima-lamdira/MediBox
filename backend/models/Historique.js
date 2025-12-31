const db = require("../config/database_manager");

/**
 * Model Historique - Simplifié pour correspondre aux fonctions disponibles
 * Utilise UNIQUEMENT les fonctions existantes dans database_manager.js
 */
const Historique = {
  /**
   * Obtenir l'historique complet d'un client
   * @param {number} id_client - ID du client
   * @returns {Promise<Array>} - Liste de l'historique
   */
  getAll: async (id_client) => {
    try {
      if (!id_client) {
        throw new Error("L'ID du client est requis");
      }
      return await db.getHistorique(id_client);
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de l'historique: ${error.message}`
      );
    }
  },

  /**
   * Valider une prise de médicament
   * @param {number} id_planning - ID du planning
   * @param {string} statut - Statut de la prise ("pris", "oublie", "en-retard")
   * @returns {Promise<boolean>} - True si succès
   */
  validate: async (id_planning, statut = "pris") => {
    try {
      if (!id_planning) {
        throw new Error("L'ID du planning est requis");
      }

      // Valider le statut
      const statutsValides = ["pris", "oublie", "en-retard", "en-attente"];
      if (!statutsValides.includes(statut)) {
        throw new Error(
          `Statut invalide. Valeurs acceptées: ${statutsValides.join(", ")}`
        );
      }

      return await db.validerPrise(id_planning, statut);
    } catch (error) {
      throw new Error(
        `Erreur lors de la validation de la prise: ${error.message}`
      );
    }
  },

  /**
   * Marquer une prise comme prise
   * @param {number} id_planning - ID du planning
   * @returns {Promise<boolean>} - True si succès
   */
  markTaken: async (id_planning) => {
    try {
      return await Historique.validate(id_planning, "pris");
    } catch (error) {
      throw new Error(`Erreur lors du marquage de la prise: ${error.message}`);
    }
  },

  /**
   * Marquer une prise comme oubliée
   * @param {number} id_planning - ID du planning
   * @returns {Promise<boolean>} - True si succès
   */
  markMissed: async (id_planning) => {
    try {
      return await Historique.validate(id_planning, "oublie");
    } catch (error) {
      throw new Error(`Erreur lors du marquage de l'oubli: ${error.message}`);
    }
  },

  /**
   * Marquer une prise comme en retard
   * @param {number} id_planning - ID du planning
   * @returns {Promise<boolean>} - True si succès
   */
  markLate: async (id_planning) => {
    try {
      return await Historique.validate(id_planning, "en-retard");
    } catch (error) {
      throw new Error(`Erreur lors du marquage du retard: ${error.message}`);
    }
  },

  /**
   * Obtenir les statistiques de l'historique
   * @param {number} id_client - ID du client
   * @param {string} periode - Période ("today", "week", "month", "all")
   * @returns {Promise<Object>} - Statistiques
   */
  getStats: async (id_client, periode = "all") => {
    try {
      const historique = await db.getHistorique(id_client);

      // Filtrer par période
      let historiqueFiltré = historique;
      const maintenant = new Date();

      if (periode === "today") {
        const aujourdhui = maintenant.toISOString().split("T")[0];
        historiqueFiltré = historique.filter(
          (h) => h.date_reelle && h.date_reelle.startsWith(aujourdhui)
        );
      } else if (periode === "week") {
        const semaineDerniere = new Date(maintenant);
        semaineDerniere.setDate(maintenant.getDate() - 7);
        historiqueFiltré = historique.filter(
          (h) => h.date_reelle && new Date(h.date_reelle) >= semaineDerniere
        );
      } else if (periode === "month") {
        const moisDernier = new Date(maintenant);
        moisDernier.setMonth(maintenant.getMonth() - 1);
        historiqueFiltré = historique.filter(
          (h) => h.date_reelle && new Date(h.date_reelle) >= moisDernier
        );
      }

      // Calculer les statistiques
      const total = historiqueFiltré.length;
      const prises = historiqueFiltré.filter((h) => h.statut === "pris").length;
      const oublis = historiqueFiltré.filter(
        (h) => h.statut === "oublie"
      ).length;
      const enRetard = historiqueFiltré.filter(
        (h) => h.statut === "en-retard"
      ).length;
      const enAttente = historiqueFiltré.filter(
        (h) => h.statut === "en-attente"
      ).length;

      return {
        periode,
        total,
        prises,
        oublis,
        enRetard,
        enAttente,
        tauxObservance: total > 0 ? ((prises / total) * 100).toFixed(1) : 0,
        tauxOubli: total > 0 ? ((oublis / total) * 100).toFixed(1) : 0,
      };
    } catch (error) {
      throw new Error(
        `Erreur lors du calcul des statistiques: ${error.message}`
      );
    }
  },

  /**
   * Obtenir l'historique récent (dernières entrées)
   * @param {number} id_client - ID du client
   * @param {number} limite - Nombre d'entrées à retourner
   * @returns {Promise<Array>} - Historique récent
   */
  getRecent: async (id_client, limite = 10) => {
    try {
      const historique = await db.getHistorique(id_client);
      return historique.slice(0, limite); // Déjà trié par date DESC dans database_manager
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de l'historique récent: ${error.message}`
      );
    }
  },

  /**
   * Obtenir l'historique par statut
   * @param {number} id_client - ID du client
   * @param {string} statut - Statut à filtrer
   * @returns {Promise<Array>} - Historique filtré
   */
  getByStatus: async (id_client, statut) => {
    try {
      const historique = await db.getHistorique(id_client);
      return historique.filter((h) => h.statut === statut);
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération par statut: ${error.message}`
      );
    }
  },

  /**
   * Obtenir l'historique par médicament
   * @param {number} id_client - ID du client
   * @param {string} nom_medoc - Nom du médicament
   * @returns {Promise<Array>} - Historique du médicament
   */
  getByMedicament: async (id_client, nom_medoc) => {
    try {
      const historique = await db.getHistorique(id_client);
      return historique.filter((h) => h.nom_medoc === nom_medoc);
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération par médicament: ${error.message}`
      );
    }
  },
};

module.exports = Historique;
