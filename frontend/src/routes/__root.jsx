import { createRootRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useState } from 'react'
import { ThemeContext, AuthContext } from '../contexts'
import { Film, User, MessageCircle, Home, LogOut, Sun, Moon, Search, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

const RootLayout = () => {
  const navigate = useNavigate()
  const apiKey = import.meta.env.VITE_OMDB_API_KEY

  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('cineconnect_theme');
    return savedTheme === 'dark';
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('cineconnect_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Search states
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('cineconnect_theme', newTheme ? 'dark' : 'light');
  };

  const login = (email, password) => {
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
    const savedUsers = localStorage.getItem('cineconnect_users');
    const users = savedUsers ? JSON.parse(savedUsers) : [];

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

  // Search function - returns multiple results
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return []
      
      const res = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(searchQuery)}&type=movie&page=1&apikey=${apiKey}`
      )
      const data = await res.json()
      
      if (data.Response === 'True' && data.Search) {
        return data.Search
      }
      return []
    },
    enabled: searchQuery.length >= 2,
  })

  const handleSearch = (e) => {
    e.preventDefault()
  }

const handleMovieClick = (imdbID) => {
    setSearchOpen(false)
    setSearchQuery('')
    navigate({ to: '/movies/$movieId', params: { movieId: imdbID } })
  }

  const navigation = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'Films', href: '/films', icon: Film },
    { name: 'Profil', href: '/profile', icon: User, requiresAuth: true },
    { name: 'Discussion', href: '/discussion', icon: MessageCircle, requiresAuth: true },
  ]

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <AuthContext.Provider value={{ user, login, register, logout }}>
        <div className="min-h-screen bg-[#14181c]">
          {/* Top Navbar - Letterboxd Style */}
          {user && (
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#14181c] border-b border-[#2c3440]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                  {/* Logo */}
                  <div className="flex items-center">
                    <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
                      <Film className="h-6 w-6 text-[#00e054]" />
                      <span className="ml-2 text-lg font-semibold text-white tracking-tight">CINE CONNECT</span>
                    </Link>
                  </div>

                  {/* Desktop Navigation */}
                  <div className="hidden md:flex items-center space-x-1">
                    {navigation.map((item) => {
                      if (item.requiresAuth && !user) return null
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="px-3 py-2 text-sm text-[#9ab] hover:text-[#00e054] transition-colors rounded-md hover:bg-[#1c2228]"
                        >
                          {item.name}
                        </Link>
                      )
                    })}
                  </div>

                  {/* Right Side */}
                  <div className="flex items-center space-x-3">
                    {/* Search */}
                    {searchOpen ? (
                      <div className="relative">
                        <div className="flex items-center">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ab]" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher un film..."
                            className="pl-10 pr-10 py-1.5 bg-[#1c2228] border border-[#2c3440] rounded-md text-white placeholder-[#9ab] text-sm focus:outline-none focus:border-[#00e054] w-48 md:w-56"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setSearchOpen(false)
                              setSearchQuery('')
                            }}
                            className="absolute right-2 p-1 text-[#9ab] hover:text-white transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Search Results Dropdown */}
                        {searchQuery.length >= 2 && (
                          <div className="absolute top-full mt-2 left-0 right-0 bg-[#1c2228] border border-[#2c3440] rounded-md shadow-lg max-h-80 overflow-y-auto z-50">
                            {isSearching ? (
                              <div className="p-4 text-center text-[#9ab]">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#00e054] mx-auto"></div>
                              </div>
                            ) : searchResults && searchResults.length > 0 ? (
                              <div className="py-2">
                                {searchResults.map((movie) => (
                                  <button
                                    key={movie.imdbID}
                                    onClick={() => handleMovieClick(movie.imdbID)}
                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#2c3440] transition-colors text-left"
                                  >
                                    {movie.Poster && movie.Poster !== 'N/A' ? (
                                      <img
                                        src={movie.Poster}
                                        alt={movie.Title}
                                        className="w-10 h-14 object-cover rounded"
                                      />
                                    ) : (
                                      <div className="w-10 h-14 bg-[#2c3440] rounded flex items-center justify-center">
                                        <Film className="h-4 w-4 text-[#9ab]" />
                                      </div>
                                    )}
                                    <div>
                                      <p className="text-white text-sm font-medium">{movie.Title}</p>
                                      <p className="text-[#9ab] text-xs">{movie.Year}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="p-4 text-center text-[#9ab] text-sm">
                                Aucun résultat trouvé
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button 
                        onClick={() => setSearchOpen(true)}
                        className="p-2 text-[#9ab] hover:text-[#00e054] transition-colors rounded-full hover:bg-[#1c2228]"
                        title="Rechercher"
                      >
                        <Search className="h-5 w-5" />
                      </button>
                    )}

                    {/* Theme Toggle */}
                    <button
                      onClick={toggleTheme}
                      className="p-2 text-[#9ab] hover:text-[#00e054] transition-colors rounded-full hover:bg-[#1c2228]"
                    >
                      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>

                    {/* User Profile */}
                    {user ? (
                      <div className="flex items-center space-x-3">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 hover:bg-[#1c2228] px-2 py-1 rounded-full transition-colors"
                        >
                          <div className="h-8 w-8 rounded-full bg-[#00e054] flex items-center justify-center">
                            <span className="text-sm font-medium text-black">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </Link>
                        <button
                          onClick={logout}
                          className="p-2 text-[#9ab] hover:text-red-500 transition-colors rounded-full hover:bg-[#1c2228]"
                          title="Déconnexion"
                        >
                          <LogOut className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Link
                          to="/login"
                          className="px-3 py-1.5 text-sm text-[#9ab] hover:text-[#00e054] transition-colors"
                        >
                          Connexion
                        </Link>
                        <Link
                          to="/register"
                          className="px-3 py-1.5 text-sm bg-[#00e054] text-black font-medium rounded-full hover:bg-[#00cc45] transition-colors"
                        >
                          Inscription
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </nav>
          )}

          {/* Main Content */}
          <div className={user ? "pt-14" : ""}>
            <main>
              <Outlet />
            </main>
          </div>

          {/* Mobile Bottom Navigation */}
          {user && (
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#14181c] border-t border-[#2c3440]">
              <div className="flex">
                {navigation.map((item) => {
                  if (item.requiresAuth && !user) return null
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex-1 flex flex-col items-center justify-center py-2 px-1 text-xs text-[#9ab] hover:text-[#00e054] transition-colors"
                    >
                      <item.icon className="h-5 w-5 mb-1" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          <TanStackRouterDevtools />
        </div>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
  beforeLoad: ({ location }) => {
    if (location.pathname === '/login' || location.pathname === '/register') {
      return
    }

    const user = localStorage.getItem('cineconnect_user')
    if (!user) {
      throw redirect({
        to: '/login',
        search: {},
      })
    }
  },
})
