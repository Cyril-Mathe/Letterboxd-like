# Front Row 🎬

Une plateforme web full-stack inspirée de **Letterboxd**, dédiée aux cinéphiles pour partager leurs expériences, critiques et discussions autour des films.

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql)](https://neon.tech)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org)

---

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Démarrage](#-démarrage)
- [Structure du projet](#-structure-du-projet)
- [API & Routes](#-api--routes)
- [Base de données](#-base-de-données)
- [Contributeurs](#-contributeurs)

---

## 📌 Aperçu

**CineConnect** est un écosystème social complet pour les amateurs de cinéma. Les utilisateurs peuvent :

- ✅ Gérer une **watchlist** personnelle
- ✅ **Noter et commenter** des films
- ✅ **Suivre des amis** et découvrir leurs avis
- ✅ **Chatter en temps réel** avec d'autres utilisateurs
- ✅ Recevoir des **recommandations intelligentes**
- ✅ Consulter des **profils utilisateurs** détaillés

Le projet utilise une architecture **monorepo** avec une séparation claire entre frontend et backend, facilitant la maintenance et les évolutions futures.

---

## 🎯 Fonctionnalités

### 👤 Authentification & Profil
- Inscription / Connexion sécurisée (JWT + Bcrypt)
- Récupération de mot de passe par email
- Profil utilisateur personnalisable (bio, avatar)
- Système de suivi (followers/following)

### 🎬 Gestion des films
- Visualisation des films
- Ajout à la watchlist (avec IMDb ID)
- Notes et critiques (1-5 étoiles)
- Historique des films regardés
- Affichage détaillé des informations film

### 💬 Communication en temps réel
- Chat privé entre utilisateurs (Socket.io)
- Notifications instantanées
- Historique des messages

### 🔍 Social & Découverte
- Recherche de films
- Système de follows pour suivre des amis
- Fil d'actualité des activités
- Page de recommandations personnalisées

### 📧 Notifications
- Envoi d'emails via Nodemailer
- Notifications de suivi
- Alertes des messages

---

## 🏗️ Architecture

L'application suit une architecture **monorepo full-stack** avec une séparation claire des préoccupations :

```
Letterboxd-like/
├── frontend/                    # Application React/Vite
│   ├── src/
│   │   ├── components/          # Composants réutilisables
│   │   ├── routes/              # Pages (file-based routing)
│   │   ├── lib/
│   │   │   ├── api/             # Intégration API (axios)
│   │   │   └── fonctions/       # Contexts, utilities
│   │   └── main.jsx
│   └── package.json
│
├── backend/                     # API Node.js/Express
│   ├── src/
│   │   ├── controllers/         # Logique métier
│   │   │   ├── Auth/
│   │   │   ├── User/
│   │   │   ├── Movies/
│   │   │   ├── Reviews/
│   │   │   └── Mail/
│   │   ├── routes/              # Endpoints API
│   │   ├── middleware/          # Auth, CORS, etc.
│   │   ├── model/schema.ts      # Schéma Drizzle ORM
│   │   └── db.ts                # Connexion PostgreSQL
│   ├── migrations/              # Évolutions DB
│   └── package.json
│
├── docs/                        # Documentation
│   ├── rapport.md
│   └── rapport-architecture.md
└── README.md

```

### 📊 Flux de données

```
Frontend (React)
    ↓ (REST API + WebSocket)
Backend (Express.js)
    ↓ (Drizzle ORM)
PostgreSQL (Neon)
```

**Technologies principales** :
- **Frontend** : React 19, Vite, TanStack Router/Query, TailwindCSS, Socket.io-client
- **Backend** : Node.js, Express 5, TypeScript, Drizzle ORM
- **Base de données** : PostgreSQL (Neon serverless)
- **Temps réel** : Socket.io
- **Authentification** : JWT + Bcrypt
- **Email** : Nodemailer

---

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (v18+) et **npm** (v9+)
- **Git**
- Un compte **Neon** (PostgreSQL serverless) ou PostgreSQL local
- Variables d'environnement configurées (voir [Configuration](#-configuration))

---

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/your-username/Letterboxd-like.git
cd Letterboxd-like
```

### 2. Installer les dépendances du frontend

```bash
cd frontend
npm install
```

### 3. Installer les dépendances du backend

```bash
cd ../backend
npm install
```

---

## ⚙️ Configuration

### Variables d'environnement Backend

Créez un fichier `.env` dans le dossier `backend/` :

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET=your_super_secret_key_here

# Email (Nodemailer)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173
```

### Variables d'environnement Frontend

Créez un fichier `.env` dans le dossier `frontend/` :

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🏃 Démarrage

### Mode développement

**Terminal 1 - Backend** :

```bash
cd backend
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

**Terminal 2 - Frontend** :

```bash
cd frontend
npm run dev
```

L'application est accessible sur `http://localhost:5173`

### Mode production

**Backend** :

```bash
cd backend
npm run build
npm start
```

**Frontend** :

```bash
cd frontend
npm run build
npm run preview
```

### Tests

```bash
# Frontend
cd frontend
npm run test          # Exécuter les tests
npm run test:ui       # UI des tests
npm run test:coverage # Rapport de couverture

# Linting
npm run lint
```

---

## 📂 Structure du projet

### Frontend (`src/`)

| Dossier | Description |
|---------|-------------|
| `components/` | Composants réutilisables (MovieCard, ChatPage, FriendsPage, etc.) |
| `routes/` | Pages routing TanStack Router (index, profile, chat, recommendations) |
| `lib/api/` | Queries API (reviews.js, watchedMovies.js) |
| `lib/fonctions/` | Contexts, queryClient, utilities |
| `tests/` | Tests unitaires et d'intégration |

**Composants clés** :
- `MovieCard.jsx` : Affichage d'un film
- `ChatPage.jsx` : Chat temps réel
- `FriendsPage.jsx` : Gestion des suivis
- `searchbar.jsx` : Recherche de films
- `Loader.jsx` : Indicateur de chargement

### Backend (`src/`)

| Dossier | Description |
|---------|-------------|
| `controllers/` | Logique métier (Auth, Users, Movies, Reviews, Chat) |
| `routes/` | Endpoints API REST |
| `middleware/` | Authentification JWT, CORS |
| `model/schema.ts` | Schéma Drizzle ORM (definition des tables) |
| `db.ts` | Connexion PostgreSQL/Neon |

**Controllers clés** :
- `auth.ts` : Inscription, connexion, jwt
- `users.ts` : Profils utilisateurs
- `reviews.ts` : Notes et critiques des films
- `watchedMovies.ts` : Historique films regardés
- `follows.ts` : Système de suivi
- `chat.ts` : Messages privés
- `mailControllers.ts` : Envoi d'emails

---

## 🔌 API & Routes

### Authentification

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Créer un compte |
| POST | `/api/auth/login` | Se connecter |
| POST | `/api/auth/refresh` | Rafraîchir le token JWT |
| POST | `/api/auth/logout` | Se déconnecter |

### Utilisateurs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id` | Obtenir un profil utilisateur |
| PUT | `/api/users/:id` | Modifier le profil |
| GET | `/api/users/:id/follows` | Lister les suivis |
| POST | `/api/users/:id/follow` | Suivre un utilisateur |

### Films

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/movies` | Lister tous les films |
| GET | `/api/movies/:id` | Détails d'un film |
| GET | `/api/watched-movies` | Films regardés par l'utilisateur |
| POST | `/api/watched-movies` | Ajouter à l'historique |

### Critiques/Notes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews` | Lister les critiques |
| POST | `/api/reviews` | Créer une critique |
| PUT | `/api/reviews/:id` | Modifier une critique |
| DELETE | `/api/reviews/:id` | Supprimer une critique |

### Chat (Socket.io)

| Event | Direction | Description |
|-------|-----------|-------------|
| `message` | Bidirectionnel | Envoi de message |
| `message:history` | Server → Client | Historique des messages |
| `user:online` | Server → Client | Notification de connexion |
| `user:offline` | Server → Client | Notification de déconnexion |

📖 **Documentation complète Swagger** : [SWAGGER.md](backend/SWAGGER.md)

---

## 🗄️ Base de données

### Schéma PostgreSQL

**Tables principales** :

#### `users_table`
```sql
- id (UUID, PK)
- username (String, UNIQUE)
- email (String, UNIQUE)
- password (String, hashed)
- biographie (Text, nullable)
- avatar_url (String, nullable)
- created_at (Timestamp)
- updated_at (Timestamp)
```

#### `movies_table`
```sql
- id (UUID, PK)
- title (String)
- year (Integer)
- director (String)
- synopsis (Text)
- poster_url (String)
```

#### `reviews_table`
```sql
- id (UUID, PK)
- userId (UUID, FK → users_table)
- movieId (UUID, FK → movies_table)
- imdbID (String)
- rating (Integer, CHECK: 1-5)
- comment (Text)
- created_at (Timestamp)
```

#### `watched_movies_table`
```sql
- id (UUID, PK)
- userId (UUID, FK → users_table)
- imdbID (String)
- title (String)
- poster_url (String)
- watched_at (Timestamp)
```

#### `follows_table`
```sql
- id (UUID, PK)
- followerId (UUID, FK → users_table)
- followedId (UUID, FK → users_table)
- created_at (Timestamp)
```

#### `messages_table`
```sql
- id (UUID, PK)
- senderId (UUID, FK → users_table)
- receiverId (UUID, FK → users_table)
- content (Text)
- read (Boolean)
- created_at (Timestamp)
```

### Migrations

Les migrations Drizzle sont stockées dans `backend/migrations/` :

```bash
# Appliquer les migrations
cd backend
npm run migrate

# Générer une nouvelle migration après schema change
npm run drizzle-kit generate
```

---

## 👥 Contributeurs

Ce projet a été développé par :

| Contributeur | Rôle | Expertise |
|--------------|------|----------|
| **Diarra Ben Moriba** | Frontend Lead | React, Vite, TanStack, TailwindCSS |
| **Cyrile Mathé** | Backend Lead | Node.js, Express, PostgreSQL, Drizzle |