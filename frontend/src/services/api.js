import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Configuration Axios avec intercepteurs
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour logger les requêtes (dev only)
apiClient.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`🔵 ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (process.env.NODE_ENV === "development") {
      console.error("🔴 API Error:", error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export const api = {
  // ===================================
  // CLIENTS
  // ===================================
  login: (email, password) => apiClient.post("/clients/login", { email, password }),
  getClient: (id) => apiClient.get(`/clients/${id}`),
  getPerformanceGlobale: (id) =>
    apiClient.get(`/clients/${id}/performance-globale`),

  // ===================================
  // MEDICAMENTS
  // ===================================
  getMedicaments: (params = {}) => apiClient.get("/medicaments", { params }),
  getMedicamentsByClient: (clientId) =>
    apiClient.get(`/medicaments/client/${clientId}`),
  getMedicament: (id, params = {}) => apiClient.get(`/medicaments/${id}`, { params }),
  createMedicament: (data) => apiClient.post("/medicaments", data),
  verifierStock: (id, params = {}) => apiClient.get(`/medicaments/${id}/verifier-stock`, { params }),

  // ===================================
  // PLANNINGS
  // ===================================
  getPlannings: (params = {}) => apiClient.get("/plannings", { params }),
  getPlanningsByMedicament: (medicamentId, params = {}) =>
    apiClient.get(`/plannings/medicament/${medicamentId}`, { params }),
  getTodayPlannings: (params = {}) => apiClient.get("/plannings/today", { params }),
  getNextIntake: (clientId) => apiClient.get(`/plannings/next${clientId ? `?clientId=${clientId}` : ""}`),
  getPlanningStats: (params = {}) => apiClient.get("/plannings/stats", { params }),

  // ===================================
  // HISTORIQUES
  // ===================================
  getHistoriques: (params = {}) => apiClient.get("/historiques", { params }),
  getIntakeHistory: (clientId) => apiClient.get(`/historiques${clientId ? `?clientId=${clientId}` : ""}`),
  getHistoriqueStats: (params = {}) => apiClient.get("/historiques/stats", { params }),
  getHistoriqueByMedicament: (nomMedoc, params = {}) => 
    apiClient.get(`/historiques/medicament/${nomMedoc}`, { params }),
  validatePrise: (id, statut) => apiClient.post(`/historiques/validate/${id}`, { statut }),
  marquerPrise: (historiqueId) =>
    apiClient.post(`/historiques/marquer-prise/${historiqueId}`),
  marquerOubli: (historiqueId) =>
    apiClient.post(`/historiques/marquer-oubli/${historiqueId}`),

  // ===================================
  // COMMANDES (Buzzer, LED)
  // ===================================
  activateBuzzer: () => apiClient.post("/commands/buzzer"),
  activateLED: () => apiClient.post("/commands/led"),
  getCommandHistory: () => apiClient.get("/commands/history"),

  // ===================================
  // SANTÉ DU SERVEUR
  // ===================================
  healthCheck: () => axios.get(`${API_URL.replace("/api", "")}/api/health`),
};

export default api;
