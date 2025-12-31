const db = require("../config/database_manager");

/**
 * Model Planning - Simplifié pour correspondre aux fonctions disponibles
 * Utilise UNIQUEMENT les fonctions existantes dans database_manager.js
 */
const Planning = {
  /**
   * Obtenir tous les plannings d'un client
   * @param {number} id_client - ID du client
   * @returns {Promise<Array>} - Liste des plannings avec les noms de médicaments
   */
  getAll: async (id_client) => {
    try {
      if (!id_client) {
        throw new Error("L'ID du client est requis");
      }
      return await db.getPlanning(id_client);
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des plannings: ${error.message}`
      );
    }
  },

  /**
   * Obtenir un planning spécifique par son ID
   * Note: Utilise getAll et filtre le résultat
   * @param {number} id_planning - ID du planning
   * @param {number} id_client - ID du client
   * @returns {Promise<Object|null>} - Planning trouvé ou null
   */
  getById: async (id_planning, id_client) => {
    try {
      const plannings = await db.getPlanning(id_client);
      const planning = plannings.find((p) => p.id_planning === id_planning);
      return planning || null;
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération du planning: ${error.message}`
      );
    }
  },

  /**
   * Obtenir les plannings du jour actuel
   * Filtre les plannings pour le jour actuel (tous sont considérés comme actifs)
   * @param {number} id_client - ID du client
   * @returns {Promise<Array>} - Plannings d'aujourd'hui
   */
  getToday: async (id_client) => {
    try {
      const plannings = await db.getPlanning(id_client);

      // Tous les plannings sont considérés comme actifs pour aujourd'hui
      // car la colonne 'actif' n'existe pas dans la base
      return plannings;
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des plannings du jour: ${error.message}`
      );
    }
  },

  /**
   * Obtenir le prochain planning à venir
   * @param {number} id_client - ID du client
   * @returns {Promise<Object|null>} - Prochain planning ou null
   */
  getNext: async (id_client) => {
    try {
      const planningsDuJour = await Planning.getToday(id_client);

      if (planningsDuJour.length === 0) {
        return null;
      }

      const heureActuelle = new Date().toTimeString().slice(0, 5); // Format "HH:MM"

      // Trier par heure et trouver le prochain
      // Conversion de TIME vers string pour la comparaison
      const planningsFuturs = planningsDuJour
        .filter((p) => {
          const heurePlanning = p.heure_prevue instanceof Date 
            ? p.heure_prevue.toTimeString().slice(0, 5)
            : p.heure_prevue.toString().slice(0, 5);
          return heurePlanning > heureActuelle;
        })
        .sort((a, b) => {
          const heureA = a.heure_prevue instanceof Date 
            ? a.heure_prevue.toTimeString().slice(0, 5)
            : a.heure_prevue.toString().slice(0, 5);
          const heureB = b.heure_prevue instanceof Date 
            ? b.heure_prevue.toTimeString().slice(0, 5)
            : b.heure_prevue.toString().slice(0, 5);
          return heureA.localeCompare(heureB);
        });

      return planningsFuturs.length > 0 ? planningsFuturs[0] : null;
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération du prochain planning: ${error.message}`
      );
    }
  },

  /**
   * Obtenir les plannings par médicament
   * @param {number} id_medoc - ID du médicament
   * @param {number} id_client - ID du client
   * @returns {Promise<Array>} - Plannings du médicament
   */
  getByMedicament: async (id_medoc, id_client) => {
    try {
      const plannings = await db.getPlanning(id_client);
      return plannings.filter((p) => p.id_medoc === id_medoc);
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des plannings du médicament: ${error.message}`
      );
    }
  },

  /**
   * Vérifier si un planning est actif pour aujourd'hui
   * Tous les plannings sont considérés comme actifs car la colonne n'existe pas
   * @param {number} id_planning - ID du planning
   * @param {number} id_client - ID du client
   * @returns {Promise<boolean>} - True si le planning existe
   */
  isActiveToday: async (id_planning, id_client) => {
    try {
      const planning = await Planning.getById(id_planning, id_client);

      // Si le planning existe, il est considéré comme actif
      // car la colonne 'actif' n'existe pas dans la base
      return planning !== null;
    } catch (error) {
      throw new Error(
        `Erreur lors de la vérification du planning: ${error.message}`
      );
    }
  },

  /**
   * Obtenir les statistiques des plannings
   * @param {number} id_client - ID du client
   * @returns {Promise<Object>} - Statistiques
   */
  getStats: async (id_client) => {
    try {
      const plannings = await db.getPlanning(id_client);
      const planningsDuJour = await Planning.getToday(id_client);

      return {
        total: plannings.length,
        // Tous les plannings sont considérés comme actifs
        // car la colonne 'actif' n'existe pas dans la base
        actifs: plannings.length,
        inactifs: 0,
        aujourdhui: planningsDuJour.length,
      };
    } catch (error) {
      throw new Error(
        `Erreur lors du calcul des statistiques: ${error.message}`
      );
    }
  },
};

module.exports = Planning;
