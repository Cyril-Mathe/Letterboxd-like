# Rapport d'Architecture - CineConnect

## 1. Introduction et Répartition des Rôles

**CineConnect** est un projet collaboratif réalisé par deux développeurs : **Diarra ben moriba** et **Cyrile Mathé**. Le développement s'est fait de manière progressive et itérative, en avançant pas à pas pour assurer une intégration fluide entre les parties frontend et backend.

### Répartition des rôles :
- **Diarra (Frontend )** : Responsable principal du frontend React. Création des composants UI (MovieCard, ChatPage, FriendsPage, Loader), implémentation des routes avec TanStack Router (profil, chat, amis, recommandations, films, login/register), intégration TanStack Query pour les API calls, state management avec Zustand/contexts, styling TailwindCSS, et liaison Socket.io-client pour le chat temps réel.
- **Cyrile Mathé (Backend )** : En charge du backend Node.js/Express. Modélisation DB avec Drizzle/schema.ts, migrations PostgreSQL, controllers (auth/users/movies/reviews/watched/follows/chat/mail), middleware auth JWT, routes.ts, intégration Socket.io serveur, Nodemailer pour emails.

Cette répartition claire a permis une spécialisation efficace, avec des réunions régulières pour l'alignement (formats API, events Socket.io). Le monorepo facilite le partage et les tests end-to-end.

## 2. Architecture Globale

L'architecture est un **monorepo full-stack** avec découpage clair :

```
pjt cine/
├── docs/                 # Rapports & docs
├── Letterboxd-like/
    ├── frontend/         # React/Vite app
    │   ├── src/routes/   # Pages : index, profile, chat, friends, recommendations...
    │   ├── src/components/ # UI réutilisables
    │   └── src/lib/api/   # Queries API (reviews, watchedMovies)
    └── backend/           # Node/Express API
        ├── src/controllers/ # Logique métier : auth, movies, reviews, chat...
        ├── src/model/schema.ts # DB schema Drizzle
        ├── src/routes/     # Endpoints API
        ├── migrations/     # Évolutions DB
        └── src/db.ts       # Connexion Postgres/Neon
```

- **Flux** : Frontend → API Backend (REST + WS) → PostgreSQL.
- **Temps réel** : Socket.io bi-directionnel pour chat/messages.
- **External** : IMDB IDs pour films (pas d'API call direct visible, mais via imdb_id).

## 3. Détails Techniques par Couche

### 3.1 Frontend (Diarra)
**Stack** : React 19, Vite, @tanstack/react-router (file-based routing), @tanstack/react-query (data fetching/caching), TailwindCSS/@tailwindcss/vite, Zustand, react-toastify/toast, lucide-react (icônes), socket.io-client.

**Implémentations clés** :
- Routes protégées (__root.jsx, auth guards).
- Pages dynamiques (movies/$movieId.jsx, recommendations.jsx).
- Composants interactifs (searchbar.jsx, modern-recommendations.css).
- Queries API (lib/api/reviews.js, watchedMovies.js).

**Défis rencontrés** :
- Sync chat temps réel : Gestion états optimistes avec Query + Socket.io (pending messages).
- Routing complexe : TanStack Router pour nested routes/protected.
- Responsive UI : Tailwind pour mobile-first, debugging cross-browser.

### 3.2 Backend (Cyrile Mathé)
**Stack** : Node.js ESM, Express 5, TypeScript, Drizzle ORM/Kit, PostgreSQL (@neondatabase/serverless/pg), JWT/jsonwebtoken, Bcrypt, Socket.io, Nodemailer, Cors.

**Implémentations clés** :
- Controllers modulaires (User/auth.ts/chat.ts/follows.ts, Movies/movies.ts/watchedMovies.ts, Reviews/reviews.ts, Mail/mailControllers.js).
- Schema.ts : Relations FK (userId/movieId), checks (rating 1-5), indexes implicites.
- Middleware/auth.ts : Vérif JWT/ownership.
- Migrations : 0000-0004 (ajouts watched/imdb/messages).

**Défis rencontrés** :
- Migrations DB : Sync schema évolutif sans downtime (Drizzle meta/_journal).
- Auth sécurisée : JWT refresh/roles, bcrypt salage.
- Socket.io scale : Rooms par user/chat, broadcast follows.
- Email prod : Nodemailer config SMTP/Neon vars.

### 3.3 Base de Données (Collaboration)
**Postgres/Neon** : Serverless, scalable.
**Tables principales** :
| Table | Champs clés | Relations |
|-------|-------------|-----------|
| users_table | id, username, email, password, biographie, avatar_url | 1:N reviews/watched/follows/messages |
| movies_table | id, title, year, director, synopsis, poster_url | N:1 reviews |
| reviews_table | userId, movieId, imdbID, rating (check 1-5), comment | FK users/movies |
| watched_movies_table | userId, imdbID, title, poster_url | FK users |
| follows_table | followerId, followedId | Self-FK users |
| messages_table | senderId, receiverId, content | FK users |

**Défis** : Index perf (non explicites, à ajouter), queries join complexes (reviews + user bio + movie poster).

## 4. Choix Techniques Justifiés

| Technologie | Raison | Alternative rejetée |
|-------------|--------|---------------------|
| Drizzle ORM | TypeScript-safe, migrations auto, lightweight vs Prisma | Prisma (trop heavy) |
| TanStack Router | File-based, type-safe vs React Router v6 | Next.js (pas monorepo) |
| Socket.io | WS fiable, fallback polling, rooms | Pure WS (complex) |
| Neon Postgres | Serverless gratuit, branchable | Supabase (moins SQL pur) |
| Tailwind | Utility-first rapide | CSS modules (lent) |

Choix alignés sur perf, DX (dev experience), et scalabilité.

## 5. Difficultés Rencontrées et Solutions

**Collaboration** :
- **Difficulté** : Formats API incohérents (front attend {data}, back renvoie array).
  **Solution** : Contrats docs manuels + Postman tests.

**Frontend (Diarra)** :
- **Diff** : Cache Query invalide après chat/update review.
  **Sol** : InvalidateQueries on Socket events.

**Backend (Cyrile)** :
- **Diff** : Migration adds champs sans default → erreurs prod.
  **Sol** : Defaults/timestamps, test-db.js.

**Commun** :
- **Diff** : Socket auth (JWT handshake).
  **Sol** : Middleware Socket + verify JWT.
- **Diff** : CORS dev/prod.
  **Sol** : .env + cors origins dynamiques.

**DB** :
- **Diff** : Relations circulaires (follows self-ref).
  **Sol** : FK cascade restrict.

## 6
