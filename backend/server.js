const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
require("dotenv").config();

const db = require("./config/database_manager");
const Client = require("./models/Client");
const Planning = require("./models/Planning");
const Historique = require("./models/Historique");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes API
app.use("/api/clients", require("./routes/clientRoutes"));
app.use("/api/medicaments", require("./routes/medicamentRoutes"));
app.use("/api/plannings", require("./routes/planningRoutes"));
app.use("/api/historiques", require("./routes/historiqueRoutes"));

// Routes de commande (Buzzer, LED)
app.post("/api/commands/buzzer", (req, res) => {
  console.log("🔔 Activation du buzzer");

  // Émettre via Socket.io
  io.emit("buzzer-activated", {
    timestamp: new Date(),
    message: "Buzzer activé",
  });

  // TODO: Envoyer la commande au Raspberry Pi ici

  res.json({
    success: true,
    message: "Buzzer activé avec succès",
  });
});

app.post("/api/commands/led", (req, res) => {
  console.log("💡 Activation de la LED");

  // Émettre via Socket.io
  io.emit("led-activated", {
    timestamp: new Date(),
    message: "LED activée",
  });

  // TODO: Envoyer la commande au Raspberry Pi ici

  res.json({
    success: true,
    message:
      "LED activée avec succès. La lumière verte sur la Medibox est allumée.",
  });
});

// GET historique des commandes (mock data pour l'instant)
let commandHistory = [
  {
    id: 1,
    date: "24 avr. 2024",
    time: "11:15",
    command: "LED Activée",
    status: "success",
  },
  {
    id: 2,
    date: "24 avr. 2024",
    time: "08:30",
    command: "Buzzer Activé",
    status: "success",
  },
];

app.get("/api/commands/history", (req, res) => {
  res.json(commandHistory);
});

// Socket.io pour temps réel
io.on("connection", (socket) => {
  console.log("✅ Client connecté:", socket.id);

  // Envoie l'heure actuelle chaque seconde
  const clockInterval = setInterval(() => {
    socket.emit("clock-update", {
      time: new Date().toLocaleTimeString("fr-FR"),
    });
  }, 1000);

  // Statut de la MediBox
  socket.on("request-status", async () => {
    try {
      // Utiliser un clientId par défaut pour le demo (client 1)
      const clientId = 1;
      
      // Obtenir les médicaments (stocks) du client
      const medicaments = await Client.getMedicaments(clientId);
      
      // Obtenir le prochain planning
      const nextPlanning = await Planning.getNext(clientId);

      socket.emit("box-status", {
        online: true,
        lastUpdate: new Date(),
        stocks: medicaments,
        nextPlanning: nextPlanning,
      });
    } catch (error) {
      console.error("Erreur request-status:", error);
      socket.emit("box-status", {
        online: false,
        error: error.message,
      });
    }
  });

  // Commande LED/Buzzer via socket
  socket.on("activate-device", (data) => {
    console.log("📡 Commande Socket reçue:", data);

    // Ajouter à l'historique des commandes
    commandHistory.unshift({
      id: commandHistory.length + 1,
      date: new Date().toLocaleDateString("fr-FR"),
      time: new Date().toLocaleTimeString("fr-FR"),
      command: `${data.device} Activé`,
      status: "success",
    });

    // Broadcast à tous les autres clients
    socket.broadcast.emit("device-activated", {
      device: data.device,
      timestamp: new Date(),
    });

    socket.emit("command-result", {
      success: true,
      device: data.device,
      message: `${data.device} activé avec succès`,
    });
  });

  // Notification de prise de médicament
  socket.on("medicine-taken", async (data) => {
    console.log("💊 Médicament pris:", data);

    try {
      // Enregistrer dans la base de données
      if (data.id_planning) {
        await Historique.markTaken(data.id_planning);
      }

      // Broadcast aux autres clients
      io.emit("medicine-status-updated", {
        id_planning: data.id_planning,
        id_historique: data.id_historique,
        statut: "pris",
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Erreur medicine-taken:", error);
      socket.emit("error", { message: error.message });
    }
  });

  // Demande des plannings du jour
  socket.on("request-today-plannings", async () => {
    try {
      // Utiliser un clientId par défaut pour le demo (client 1)
      const clientId = 1;
      const planningsDuJour = await Planning.getToday(clientId);
      socket.emit("today-plannings", planningsDuJour);
    } catch (error) {
      console.error("Erreur request-today-plannings:", error);
      socket.emit("error", { message: error.message });
    }
  });

// Demande des statistiques
  socket.on("request-statistics", async (data) => {
    try {
      // Utiliser un clientId par défaut pour le demo (client 1)
      const clientId = 1;
      const stats = await Historique.getStats(clientId, data?.periode || "today");
      socket.emit("statistics-data", stats);
    } catch (error) {
      console.error("Erreur request-statistics:", error);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("disconnect", () => {
    clearInterval(clockInterval);
    console.log("❌ Client déconnecté:", socket.id);
  });
});

// Route de test
app.get("/", (req, res) => {
  res.json({
    message: "MediBox API - Serveur actif",
    version: "2.0.0 (SQLite)",
    database: "SQLite3",
    endpoints: {
      clients: "/api/clients",
      medicaments: "/api/medicaments",
      plannings: "/api/plannings",
      historiques: "/api/historiques",
      commands: "/api/commands",
    },
  });
});

// Route de santé
app.get("/api/health", async (req, res) => {
  try {
    // Test simple avec la base de données via le login
    const testClient = await db.login("test@test.com", "test");
    
    res.json({
      status: "OK",
      database: "Connected",
      message: "Base de données accessible via database_manager",
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      database: "Disconnected",
      error: error.message,
    });
  }
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Erreur serveur",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Une erreur est survenue",
  });
});

// Gestion de la fermeture propre
process.on("SIGINT", () => {
  console.log("\n⚠️  Arrêt du serveur en cours...");
  // Note: closeDatabase() n'existe pas dans database_manager
  console.log("✅ Serveur arrêté proprement");
  server.close(() => {
    process.exit(0);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🏥 MEDIBOX SERVER - SQLite Edition  ║
╠════════════════════════════════════════╣
║  🚀 Serveur: http://localhost:${PORT}     ║
║  📡 Socket.io: ws://localhost:${PORT}     ║
║  🗄️  Database: SQLite (DBIOT.db)        ║
╚════════════════════════════════════════╝
  `);
});

module.exports = { app, io, db };
