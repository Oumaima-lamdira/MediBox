# 🏥 Medical Box - Smart Medication Management System

Une solution complète de gestion de médicaments avec boîtier intelligent pour les personnes âgées ou dépendantes.

## 📋 Description

Medical Box est un système IoT qui aide les utilisateurs à prendre leurs médicaments au bon moment grâce à :
- Une interface web intuitive
- Un boîtier physique avec buzzer et LED
- Un suivi en temps réel des prises
- Des alertes intelligentes de stock faible

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   React.js      │◄──►│   Node.js       │◄──►│   SQLite3       │
│   (Port 3000)   │    │   (Port 5000)   │    │   DBIOT.db      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   IoT Device    │
                       │   (Raspberry Pi)│
                       │   Buzzer + LED  │
                       └─────────────────┘
```

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 16+ 
- npm ou yarn
- Git

### Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd medical-box-project
```

2. **Installer les dépendances backend**
```bash
cd backend
npm install
```

3. **Installer les dépendances frontend**
```bash
cd ../frontend
npm install
```

4. **Démarrer le backend**
```bash
cd ../backend
npm start
```
Le serveur démarre sur `http://localhost:5000`

5. **Démarrer le frontend**
```bash
cd ../frontend
npm start
```
L'application démarre sur `http://localhost:3000`

## 🔧 Configuration

### Variables d'environnement

Créer un fichier `.env` dans le dossier `backend` :

```env
# Configuration du serveur
PORT=5000

# Configuration Socket.io
SOCKET_CORS_ORIGIN=http://localhost:3000

# Configuration base de données
DB_PATH=./config/DBIOT.db
```

### Base de données

La base de données SQLite est initialisée automatiquement avec des données de test :

**Utilisateur de test :**
- Email : `jean.dupont@example.com`
- Mot de passe : `password123`

**Médicament de test :**
- Nom : `Doliprane 500mg`
- Stock : 30 doses

**Planning de test :**
- Prises à 09:00, 15:30, 19:00

## 📱 Fonctionnalités

### 🔐 Authentification
- Login sécurisé avec email/mot de passe
- Session persistante
- Redirection automatique

### 💊 Gestion des Médicaments
- Ajout de médicaments
- Suivi du stock en temps réel
- Alertes de stock faible (< 7 doses)
- Informations détaillées par médicament

### ⏰ Planning des Prises
- Création d'horaires de prise
- Planning journalier
- Prochaine prise à venir
- Statistiques des plannings

### 📊 Historique et Statistiques
- Suivi complet des prises
- Statistiques par période (jour/semaine/mois)
- Taux d'observance
- Performance globale

### 🎛️ Contrôle IoT
- Activation du buzzer
- Allumage LED
- Historique des commandes
- Communication temps réel via Socket.io

### 📡 Temps Réel
- Mises à jour automatiques
- Notifications instantanées
- Synchronisation multi-appareils

## 🛠️ API Endpoints

### Clients
- `POST /api/clients/login` - Authentification
- `GET /api/clients/:id` - Données client
- `GET /api/clients/:id/performance-globale` - Statistiques

### Médicaments
- `GET /api/medicaments?id_client=:id` - Liste médicaments
- `GET /api/medicaments/client/:id` - Médicaments d'un client
- `POST /api/medicaments` - Ajouter médicament
- `GET /api/medicaments/:id/verifier-stock?id_client=:id` - Vérifier stock

### Plannings
- `GET /api/plannings?id_client=:id` - Liste plannings
- `GET /api/plannings/today?id_client=:id` - Plannings du jour
- `GET /api/plannings/next?clientId=:id` - Prochaine prise
- `GET /api/plannings/stats?id_client=:id` - Statistiques

### Historiques
- `GET /api/historiques?clientId=:id` - Historique complet
- `GET /api/historiques/stats?clientId=:id` - Statistiques
- `POST /api/historique/validate/:id` - Valider une prise
- `POST /api/historique/marquer-prise/:id` - Marquer comme pris

### Commandes IoT
- `POST /api/commands/buzzer` - Activer buzzer
- `POST /api/commands/led` - Activer LED
- `GET /api/commands/history` - Historique commandes

## 🗄️ Structure de la Base de Données

### Tables principales

**Client**
```sql
- id_client (PRIMARY KEY)
- nom (TEXT)
- age (INTEGER)
- telephone_urgence (TEXT)
- email (UNIQUE)
- password (TEXT)
```

**Medicament**
```sql
- id_medoc (PRIMARY KEY)
- id_client (FOREIGN KEY)
- nom_medoc (TEXT)
- stock_actuel (INTEGER)
```

**Planning**
```sql
- id_planning (PRIMARY KEY)
- id_medoc (FOREIGN KEY)
- heure_prevue (TIME)
```

**Historique**
```sql
- id_historique (PRIMARY KEY)
- id_planning (FOREIGN KEY)
- date_reelle (DATETIME)
- statut (TEXT) -- 'pris', 'oublie', 'en-retard'
```

## 🎯 Utilisation

### 1. Connexion
1. Accéder à `http://localhost:3000`
2. Utiliser les identifiants de test ou créer un compte
3. Se connecter pour accéder au dashboard

### 2. Dashboard
- Vue d'ensemble du statut de la Medical Box
- Prochaine prise médicamenteuse
- Statistiques en temps réel

### 3. Gestion des médicaments
- Ajouter vos médicaments avec stock initial
- Consulter les alertes de stock faible
- Supprimer les médicaments obsolètes

### 4. Planning
- Créer des horaires de prise
- Consulter le planning du jour
- Voir les statistiques d'observance

### 5. Historique
- Consulter l'historique des prises
- Voir les statistiques par période
- Marquer manuellement les prises

### 6. Contrôle IoT
- Tester le buzzer et la LED
- Voir l'historique des commandes
- Contrôler à distance le boîtier

## 🔧 Développement

### Structure des dossiers

```
medical-box-project/
├── backend/
│   ├── config/
│   │   ├── database_manager.js    # Gestion base de données
│   │   └── schema.sql             # Schéma SQL
│   ├── models/                    # Models de données
│   │   ├── Client.js
│   │   ├── Medicament.js
│   │   ├── Planning.js
│   │   └── Historique.js
│   ├── routes/                    # Routes API
│   │   ├── clientRoutes.js
│   │   ├── medicamentRoutes.js
│   │   ├── planningRoutes.js
│   │   └── historiqueRoutes.js
│   └── server.js                  # Serveur principal
├── frontend/
│   ├── src/
│   │   ├── components/             # Composants React
│   │   ├── pages/                  # Pages principales
│   │   ├── services/               # Services API
│   │   └── styles/                 # Styles CSS
└── README.md
```

### Scripts disponibles

**Backend**
```bash
npm start          # Démarrer le serveur
npm run dev        # Mode développement
npm run init-db    # Initialiser la base de données
```

**Frontend**
```bash
npm start          # Démarrer l'application
npm run build      # Build pour production
npm test           # Lancer les tests
```

## 🐛 Dépannage

### Problèmes courants

**"Cannot find module 'sqlite3'"**
```bash
cd backend
npm install
```

**"EADDRINUSE : address already in use"**
```bash
# Changer le port dans .env ou tuer le processus
lsof -ti:5000 | xargs kill -9
```

**"Database locked"**
```bash
# Redémarrer le serveur backend
npm start
```

### Logs et debugging

- **Backend** : Logs dans la console du serveur
- **Frontend** : Logs dans la console du navigateur (F12)
- **Database** : Fichier `DBIOT.db` dans `backend/config/`

## 🔒 Sécurité

- Les mots de passe sont hashés (à implémenter)
- Communication HTTPS recommandée en production
- Validation des entrées côté serveur
- CORS configuré pour les origines autorisées

## 🚀 Déploiement

### Production
1. **Build frontend**
```bash
cd frontend
npm run build
```

2. **Configurer les variables d'environnement**
3. **Utiliser PM2 ou un process manager**
4. **Configurer un reverse proxy (Nginx)**
5. **Mettre en place HTTPS**

### Docker
```dockerfile
# Dockerfile à créer pour déploiement conteneurisé
```

## 🤝 Contribuer

1. Forker le projet
2. Créer une branche de fonctionnalité
3. Committer les changements
4. Pousser vers la branche
5. Créer une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Contacter le développeur principal

---

**Développé avec ❤️ pour aider les personnes à prendre leurs médicaments correctement.**