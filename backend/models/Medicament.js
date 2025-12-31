const db = require("../config/database_manager");

/**
 * Model Medicament - Simplifié pour correspondre aux fonctions disponibles
 * Utilise UNIQUEMENT les fonctions existantes dans database_manager.js
 */
const Medicament = {
  /**
   * Obtenir tous les médicaments d'un client
   * @param {number} id_client - ID du client
   * @returns {Promise<Array>} - Liste des médicaments
   */
  getAll: async (id_client) => {
    try {
      if (!id_client) {
        throw new Error("L'ID du client est requis");
      }
      return await db.getMedicaments(id_client);
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des médicaments: ${error.message}`
      );
    }
  },

  /**
   * Obtenir un médicament par son ID
   * Note: Cette fonction utilise getAll et filtre le résultat
   * car il n'y a pas de fonction getMedicamentById dans database_manager
   * @param {number} id_medoc - ID du médicament
   * @param {number} id_client - ID du client (requis pour la recherche)
   * @returns {Promise<Object|null>} - Médicament trouvé ou null
   */
  getById: async (id_medoc, id_client) => {
    try {
      if (!id_client) {
        throw new Error("L'ID du client est requis");
      }
      const medicaments = await db.getMedicaments(id_client);
      const medicament = medicaments.find((m) => m.id_medoc === id_medoc);
      return medicament || null;
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération du médicament: ${error.message}`
      );
    }
  },

  /**
   * Créer un nouveau médicament
   * @param {number} id_client - ID du client
   * @param {string} nom_medoc - Nom du médicament
   * @param {number} stock_actuel - Stock initial
   * @returns {Promise<Object>} - Résultat de la création
   */
  create: async (id_client, nom_medoc, stock_actuel = 0) => {
    try {
      if (!id_client || !nom_medoc) {
        throw new Error("L'ID du client et le nom du médicament sont requis");
      }

      const result = await db.addMedicament(id_client, nom_medoc, stock_actuel);

      return {
        success: true,
        id_medoc: result.id,
        message: "Médicament créé avec succès",
      };
    } catch (error) {
      throw new Error(
        `Erreur lors de la création du médicament: ${error.message}`
      );
    }
  },

  /**
   * Vérifier le stock d'un médicament
   * @param {number} id_medoc - ID du médicament
   * @param {number} id_client - ID du client
   * @returns {Promise<Object>} - Informations sur le stock
   */
  checkStock: async (id_medoc, id_client) => {
    try {
      const medicament = await Medicament.getById(id_medoc, id_client);

      if (!medicament) {
        throw new Error("Médicament non trouvé");
      }

      return {
        id_medoc: medicament.id_medoc,
        nom_medoc: medicament.nom_medoc,
        stock_actuel: medicament.stock_actuel,
        stockFaible: medicament.stock_actuel < 5,
        stockVide: medicament.stock_actuel === 0,
      };
    } catch (error) {
      throw new Error(
        `Erreur lors de la vérification du stock: ${error.message}`
      );
    }
  },

  /**
   * Obtenir tous les médicaments avec leur statut de stock
   * @param {number} id_client - ID du client
   * @returns {Promise<Array>} - Liste des médicaments avec statut de stock
   */
  getAllWithStockStatus: async (id_client) => {
    try {
      const medicaments = await db.getMedicaments(id_client);

      return medicaments.map((m) => ({
        ...m,
        stockFaible: m.stock_actuel < 5,
        stockVide: m.stock_actuel === 0,
        stockOK: m.stock_actuel >= 5,
      }));
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des stocks: ${error.message}`
      );
    }
  },
};

module.exports = Medicament;
