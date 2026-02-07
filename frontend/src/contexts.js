import { createContext } from 'react';

// Context pour le thème
export const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
});

// Context pour l'authentification
export const AuthContext = createContext({
  user: null,
  login: () => false,
  register: () => false,
  logout: () => {},
});
