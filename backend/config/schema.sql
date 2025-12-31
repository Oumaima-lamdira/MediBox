-- Schéma de la base de données DBIOT.db
-- Adapté pour correspondre à la structure existante et database_manager.js

-- Table Client
CREATE TABLE IF NOT EXISTS Client (
    id_client INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    age INTEGER,
    telephone_urgence TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- Table Medicament
CREATE TABLE IF NOT EXISTS Medicament (
    id_medoc INTEGER PRIMARY KEY AUTOINCREMENT,
    id_client INTEGER,
    nom_medoc TEXT NOT NULL,
    stock_actuel INTEGER,
    FOREIGN KEY (id_client) REFERENCES Client(id_client) ON DELETE CASCADE
);

-- Table Planning
CREATE TABLE IF NOT EXISTS Planning (
    id_planning INTEGER PRIMARY KEY AUTOINCREMENT,
    id_medoc INTEGER,
    heure_prevue TIME NOT NULL,
    FOREIGN KEY (id_medoc) REFERENCES Medicament(id_medoc) ON DELETE CASCADE
);

-- Table Historique
CREATE TABLE IF NOT EXISTS Historique (
    id_historique INTEGER PRIMARY KEY AUTOINCREMENT,
    id_planning INTEGER,
    date_reelle DATETIME DEFAULT CURRENT_TIMESTAMP,
    statut TEXT,
    FOREIGN KEY (id_planning) REFERENCES Planning(id_planning) ON DELETE CASCADE
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_medicament_client ON Medicament(id_client);
CREATE INDEX IF NOT EXISTS idx_planning_medoc ON Planning(id_medoc);
CREATE INDEX IF NOT EXISTS idx_historique_planning ON Historique(id_planning);

-- Données de test
INSERT OR IGNORE INTO Client (id_client, nom, age, telephone_urgence, email, password) VALUES
(1, 'Jean Dupont', 75, '+33612345678', 'jean.dupont@example.com', 'password123');

INSERT OR IGNORE INTO Medicament (id_medoc, id_client, nom_medoc, stock_actuel) VALUES
(1, 1, 'Doliprane 500mg', 30);

INSERT OR IGNORE INTO Planning (id_planning, id_medoc, heure_prevue) VALUES
(1, 1, '09:00'),
(2, 1, '15:30'),
(3, 1, '19:00');