# Rapport de Projet - CineConnect

## 1. Introduction

CineConnect est une plateforme web full stack inspirée de Letterboxd, dédiée aux cinéphiles souhaitant partager leurs expériences, critiques et discussions autour des films. Le projet vise à créer un écosystème social où les utilisateurs peuvent gérer leur watchlist, noter des films, suivre des amis, chatter en temps réel et recevoir des recommandations.

Développé de manière itérative dans un monorepo, le projet progresse du frontend réactif à l'intégration backend complète avec base de données PostgreSQL, authentification sécurisée, communications temps réel et envoi d'emails. Cette approche permet une architecture cohérente et évolutive, facilitant la maintenance et les extensions futures.

## 2. Objectifs du projet

Les objectifs techniques et fonctionnels sont :

- Implémenter un frontend moderne et responsive avec routing avancé.
- Développer un backend API RESTful robuste avec authentification JWT.
- Modéliser et gérer une base PostgreSQL via Drizzle ORM avec migrations.
- Intégrer le chat temps réel via Socket.io et les notifications par email.
- Fournir des fonctionnalités sociales : follows, recommandations, watchlist.
- Assurer une séparation claire des responsabilités pour une maintenabilité optimale.

Sur le plan méthodologique : documentation claire, code modulaire, respect des best practices.

## 3. Architecture technique

L'architecture adopte un split frontend/backend avec base relationnelle :

- `frontend/` : React avec TanStack Router/Query, TailwindCSS, Vite.
-  
- `backend/` : Node.js/Express/TypeScript, Drizzle ORM, middleware auth.
- Base de données : PostgreSQL (Neon serverless) avec schémas pour users/movies/reviews/watched/follows/messages
