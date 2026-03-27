# Swagger API Documentation

Swagger/OpenAPI documentation est intégrée dans le backend Letterboxd-like pour documenter et tester les endpoints de l'API.

## 🚀 Accédez à la Documentation

Une fois le serveur démarré, accédez à:

```
http://localhost:3000/api-docs
```

## 📝 Structure de la Documentation

### Fichiers de Configuration

- **`src/swagger.ts`** - Configuration principale de Swagger
  - Définition des serveurs (dev, prod)
  - Schémas des modèles (User, Movie, Review)
  - Configuration de sécurité JWT

- **`src/swagger.routes.ts`** - Documentation des routes
  - Endpoints d'authentification
  - Endpoints des utilisateurs
  - Endpoints des critiques
  - Endpoints des films

## 🔐 Authentification

L'API utilise l'authentification JWT (Bearer Token). Dans Swagger UI:

1. Cliquez sur le bouton **"Authorize"** (cadenas)
2. Entrez: `Bearer [votre_token_jwt]`
3. Cliquez sur **Authorize**

Les endpoints protégés nécessitent cette authentification.

## 📚 Endpoints Documentés

### Authentification (`/api/v1/auth`)
- `POST /register` - Créer un compte
- `POST /login` - Se connecter

### Utilisateurs (`/api/v1/users`)
- `GET /{userId}` - Obtenir le profil d'un utilisateur
- `POST /{userId}/follow` - Suivre un utilisateur

### Critiques (`/api/v1/reviews`)
- `GET /` - Lister les critiques
- `POST /` - Créer une critique
- `PUT /{reviewId}` - Modifier une critique
- `DELETE /{reviewId}` - Supprimer une critique

### Films (`/api/v1/movies`)
- `GET /watched` - Lister les films regardés
- `POST /watched` - Marquer un film comme regardé
- `DELETE /watched/{movieId}` - Retirer un film des regardés

## ✨ Fonctionnalités de Swagger UI

✅ **Tester les endpoints** directement depuis l'interface  
✅ **Voir les schémas** et structures de données  
✅ **Copier les exemples** de requête/réponse  
✅ **Afficher les codes de statut** HTTP  
✅ **Gestion de l'authentification JWT** automatique  

## 🔧 Ajouter une Nouvelle Route

Pour documenter une nouvelle route, ajoutez les commentaires JSDoc dans `src/swagger.routes.ts`:

```javascript
/**
 * @swagger
 * /api/v1/example:
 *   get:
 *     summary: Description courte
 *     tags:
 *       - ExampleCategory
 *     responses:
 *       200:
 *         description: Succès
 */
```

## 📦 Installation (Déjà Faite)

Les packages suivants sont installés:
- `swagger-ui-express` - Interface Swagger
- `swagger-jsdoc` - Génération de la spécification OpenAPI

## 🎯 Commandes

Démarrer le serveur avec Swagger:
```bash
npm run dev
```

Accéder à Swagger UI:
```
http://localhost:3000/api-docs
```

## 📖 Ressources

- [OpenAPI 3.0.0 Specification](https://spec.openapis.org/oas/v3.0.0)
- [Swagger UI Documentation](https://github.com/swagger-api/swagger-ui)
- [Swagger JSDoc](https://github.com/Surnet/swagger-jsdoc)

---

**Version**: 1.0.0  
**Dernière mise à jour**: Mars 2026
