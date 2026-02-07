import { createRootRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useState } from 'react'
import { ThemeContext, AuthContext } from '../contexts'
import { Film, User, MessageCircle, Home, LogOut, Sun, Moon } from 'lucide-react'

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

  const navigation = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'Films', href: '/films', icon: Film },
    { name: 'Profil', href: '/profile', icon: User, requiresAuth: true },
    { name: 'Discussion', href: '/discussion', icon: MessageCircle, requiresAuth: true },
  ]

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <AuthContext.Provider value={{ user, login, register, logout }}>
        <div className={isDark ? 'dark' : ''}>
          {/* Desktop Sidebar - Only show if authenticated */}
          {user && (
            <div className={`hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col ${isDark ? 'bg-gray-800' : 'bg-white'} border-r ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-4">
                  <Film className="h-8 w-8 text-green-500" />
                  <span className="ml-2 text-xl font-bold">CinéConnect</span>
                </div>
                <div className="mt-8 flex-grow flex flex-col">
                  <nav className="flex-1 px-2 space-y-1">
                    {navigation.map((item) => {
                      if (item.requiresAuth && !user) return null
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                            window.location.pathname === item.href
                              ? 'bg-green-500 text-white'
                              : isDark
                                ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                          {item.name}
                        </Link>
                      )
                    })}
                  </nav>
                  <div className="px-2 mt-6">
                    <button
                      onClick={toggleTheme}
                      className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        isDark
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {isDark ? <Sun className="mr-3 h-5 w-5" /> : <Moon className="mr-3 h-5 w-5" />}
                      {isDark ? 'Mode clair' : 'Mode sombre'}
                    </button>
                    {user && (
                      <button
                        onClick={logout}
                        className="w-full mt-2 group flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 hover:text-red-900 transition-colors"
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        Déconnexion
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Navigation - Only show if authenticated */}
          {user && (
            <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
              <div className="flex">
                {navigation.map((item) => {
                  if (item.requiresAuth && !user) return null
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex-1 flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors ${
                        window.location.pathname === item.href
                          ? 'text-green-500'
                          : isDark
                            ? 'text-gray-400 hover:text-white'
                            : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="h-5 w-5 mb-1" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Main content */}
          <div className={user ? "md:pl-64" : ""}>
            <main className={user ? "pb-16 md:pb-0" : ""}>
              <Outlet />
            </main>
          </div>

          <TanStackRouterDevtools />
        </div>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
  beforeLoad: ({ location }) => {
    // Don't redirect for login and register pages
    if (location.pathname === '/login' || location.pathname === '/register') {
      return
    }

    // Redirect to login if not authenticated
    const user = localStorage.getItem('cineconnect_user')
    if (!user) {
      throw redirect({
        to: '/login',
        search: {},
      })
    }
  },
})
