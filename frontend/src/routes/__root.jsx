import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useState } from 'react'
import { ThemeContext, AuthContext } from '../contexts'

const RootLayout = () => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('cineconnect_theme');
    return savedTheme === 'dark';
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('cineconnect_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('cineconnect_theme', newTheme ? 'dark' : 'light');
  };

  const login = (email, password) => {
    // Simulation de connexion
    const savedUsers = localStorage.getItem('cineconnect_users');
    if (savedUsers) {
      const users = JSON.parse(savedUsers);
      const foundUser = users.find((u) => u.email === email && u.password === password);
      if (foundUser) {
        const userInfo = { id: foundUser.id, username: foundUser.username, email: foundUser.email };
        setUser(userInfo);
        localStorage.setItem('cineconnect_user', JSON.stringify(userInfo));
        return true;
      }
    }
    return false;
  };

  const register = (username, email, password) => {
    // Simulation d'inscription
    const savedUsers = localStorage.getItem('cineconnect_users');
    const users = savedUsers ? JSON.parse(savedUsers) : [];

    // Vérifier si l'email existe déjà
    if (users.find((u) => u.email === email)) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password,
    };

    users.push(newUser);
    localStorage.setItem('cineconnect_users', JSON.stringify(users));

    const userInfo = { id: newUser.id, username: newUser.username, email: newUser.email };
    setUser(userInfo);
    localStorage.setItem('cineconnect_user', JSON.stringify(userInfo));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cineconnect_user');
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <AuthContext.Provider value={{ user, login, register, logout }}>
        <div className={isDark ? 'dark' : ''}>
          <div className="p-2 flex gap-2">
            <Link to="/" className="[&.active]:font-bold">
              Home
            </Link>{' '}
            <Link to="/about" className="[&.active]:font-bold">
              About
            </Link>
          </div>
          <hr />
          <Outlet />
          <TanStackRouterDevtools />
        </div>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

export const Route = createRootRoute({ component: RootLayout })