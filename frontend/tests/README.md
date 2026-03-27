# Tests Frontend

Dossier de tests unitaires et d'intégration pour le frontend avec **Vitest** et **React Testing Library**.

## 📋 Structure

```
tests/
├── setup.js                 # Configuration de Vitest
├── Loader.test.jsx         # Tests du composant Loader
├── MovieCard.test.jsx      # Tests du composant MovieCard
├── Footer.test.jsx         # Tests du composant Footer
├── contexts.test.js        # Tests des contextes React
├── api.test.js             # Tests des utilitaires API
├── validation.test.js      # Tests de validation des formulaires
├── utils.test.js           # Tests des utilitaires génériques
└── hooks.test.jsx          # Tests des hooks React
```

## 🚀 Installation

Les dépendances ont déjà été installées:

```bash
npm install
```

## 📝 Scripts de Test

### Lancer les tests en mode watch
```bash
npm run test
```

### Lancer les tests une seule fois
```bash
npm run test:run
```

### Voir les tests avec interface graphique
```bash
npm run test:ui
```

### Générer un rapport de couverture
```bash
npm run test:coverage
```

## 📊 Objectifs de Couverture

L'objectif est d'atteindre **80% de couverture** pour:
- **Lignes**: 80%
- **Fonctions**: 80%
- **Branches**: 80%
- **Déclarations**: 80%

### Seuils configurés dans `vite.config.js`:
```javascript
coverage: {
  lines: 80,
  functions: 80,
  branches: 80,
  statements: 80
}
```

## 🧪 Tests Inclus

### 1. **Loader.test.jsx** (5 tests)
Tests des composants de chargement:
- LoadingSpinner avec mode sombre/clair
- LoadingCards avec plusieurs cartes
- PageLoader

### 2. **MovieCard.test.jsx** (7 tests)
Tests du composant de carte de film:
- Rendu du poster
- Affichage du titre, rating et année
- Gestion des posters N/A
- Propriétés alternatives

### 3. **Footer.test.jsx** (5 tests)
Tests du composant Footer:
- Rendu avec modes sombre/clair
- Présence des liens
- Classes CSS appropriées

### 4. **contexts.test.js** (6 tests)
Tests des contextes React:
- ThemeContext et AuthContext définis
- Providers accessibles
- Valeurs par défaut

### 5. **api.test.js** (17 tests)
Tests des utilitaires API:
- Requêtes GET, POST, PUT, DELETE
- Traitement des erreurs
- Parsing des données de films
- Validation des données utilisateur

### 6. **validation.test.js** (20 tests)
Tests de validation des formulaires:
- Login forms
- Register forms
- Review forms
- Search forms

### 7. **utils.test.js** (20 tests)
Tests des utilitaires génériques:
- LocalStorage
- String utilities
- Array utilities
- Object utilities
- Validation (email, password)

### 8. **hooks.test.jsx** (18 tests)
Tests des hooks React:
- useState patterns
- useCallback patterns
- Data fetching avec useEffect
- Theme management
- Pagination logic
- Filter et search logic

## 📈 Total: 98 Tests

Les tests couvrent:
- ✅ Composants React (Loader, MovieCard, Footer)
- ✅ Contextes React (Theme, Auth)
- ✅ Validation de formulaires
- ✅ Utilitaires JavaScript
- ✅ Hooks personnalisés
- ✅ Appels API
- ✅ Patterns React courants

## 🔧 Configuration

### vite.config.js
```javascript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['./tests/setup.js'],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html', 'lcov'],
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80
  }
}
```

### setup.js
Inclut:
- Cleanup automatique après chaque test
- Mock de `window.matchMedia`
- Mock de `localStorage`
- Mock d'`IntersectionObserver`

## 📌 Bonnes Pratiques

1. **Tests isolés**: Chaque test est indépendant
2. **Setup/Teardown**: Nettoyage automatique avec `afterEach`
3. **Mocks**: Utilisation de `vi.fn()` pour les fonctions
4. **Async/Await**: Gestion correcte des appels asynchrones
5. **Assertions claires**: Messages explicites

## 🎯 Exemples d'Exécution

### Voir la couverture actuelle
```bash
npm run test:coverage
```

Cela génère un rapport HTML dans `coverage/`

### Exécuter un test spécifique
```bash
npm run test:run -- Loader.test.jsx
```

### Mode watch avec hot reload
```bash
npm run test
```

## 🐛 Dépannage

### Tests qui échouent?
1. Vérifiez que toutes les dépendances sont installées
2. Vérifiez les imports dans les fichiers de test
3. Vérifiez les chemins des fichiers

### Couverture insuffisante?
1. Exécutez `npm run test:coverage` pour voir les lignes non couvertes
2. Ajoutez plus de tests pour les lignes manquantes
3. Consultez le rapport HTML généré

## 📚 Ressources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://testing-library.com/docs/queries/about)

---

**Mis à jour**: 27 Mars 2026  
**Couverture Cible**: 80%  
**Nombre de Tests**: 98
