import { createRootRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useState } from 'react'
import { ThemeContext, AuthContext } from '../contexts'
import { Film, User, MessageCircle, Home, LogOut, Sun, Moon, Sparkle, Search, X } from 'lucide-react'
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

  const login = async (identifier, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        // Fetch user data
        const meResponse = await fetch('http://localhost:3000/api/v1/me', {
          headers: { 'Authorization': `Bearer ${data.token}` }
        });
        if (meResponse.ok) {
          const meData = await meResponse.json();
          setUser(meData.user);
          localStorage.setItem('cineconnect_user', JSON.stringify(meData.user));
          return true;
        }
      }
    } catch (err) {
      console.error('Login error:', err);
    }
    return false;
  };

  const register = async (username, email, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        setUser(data.user);
        localStorage.setItem('cineconnect_user', JSON.stringify(data.user));
        return true;
      }
    } catch (err) {
      console.error('Register error:', err);
    }
    return false;
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

  const handleMovieClick = (imdbID) => {
    setSearchOpen(false)
    setSearchQuery('')
    navigate({ to: '/movies/$movieId', params: { movieId: imdbID } })
  }

  const navigation = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'Films', href: '/films', icon: Film },
    { name: 'Recommendations', href: '/recommendations', icon: Sparkle },
    { name: 'Profil', href: '/profile', icon: User, requiresAuth: true },
    { name: 'Discussion', href: '/discussion', icon: MessageCircle, requiresAuth: true },
  ]

  // Theme-based classes
  const bgMain = isDark ? 'bg-[#14181c]' : 'bg-gray-50'
  const bgCard = isDark ? 'bg-[#1c2228]' : 'bg-white'
  const borderColor = isDark ? 'border-[#2c3440]' : 'border-gray-200'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-[#9ab]' : 'text-gray-600'
  const accentColor = isDark ? 'text-[#00e054]' : 'text-green-600'
  const accentBg = isDark ? 'bg-[#00e054]' : 'bg-green-600'
  const hoverBg = isDark ? 'hover:bg-[#1c2228]' : 'hover:bg-gray-100'
  const inputBg = isDark ? 'bg-[#1c2228]' : 'bg-white'

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <AuthContext.Provider value={{ user, login, register, logout }}>
        <div className={`min-h-screen ${bgMain} transition-colors duration-300`}>
          {/* Top Navbar */}
          {user && (
            <nav className={`fixed top-0 left-0 right-0 z-50 ${bgMain} ${borderColor} border-b`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                  {/* Logo */}
                  <div className="flex items-center">
                    <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
                      <Film className={`h-6 w-6 ${accentColor}`} />
                      <span className={`ml-2 text-lg font-semibold ${textMain} tracking-tight`}>CINE CONNECT</span>
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
                          className={`px-3 py-2 text-sm ${textSecondary} ${accentColor} transition-colors rounded-md ${hoverBg}`}
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
                          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${textSecondary}`} />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher un film..."
                            className={`pl-10 pr-10 py-1.5 ${inputBg} ${borderColor} border rounded-md ${textMain} placeholder:${textSecondary} text-sm focus:outline-none focus:border-[#00e054] w-48 md:w-56`}
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setSearchOpen(false)
                              setSearchQuery('')
                            }}
                            className={`absolute right-2 p-1 ${textSecondary} hover:${textMain} transition-colors`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Search Results Dropdown */}
                        {searchQuery.length >= 2 && (
                          <div className={`absolute top-full mt-2 left-0 right-0 ${bgCard} ${borderColor} border rounded-md shadow-lg max-h-80 overflow-y-auto z-50`}>
                            {isSearching ? (
                              <div className={`p-4 text-center ${textSecondary}`}>
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#00e054] mx-auto"></div>
                              </div>
                            ) : searchResults && searchResults.length > 0 ? (
                              <div className="py-2">
                                {searchResults.map((movie) => (
                                  <button
                                    key={movie.imdbID}
                                    onClick={() => handleMovieClick(movie.imdbID)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 ${hoverBg} transition-colors text-left`}
                                  >
                                    {movie.Poster && movie.Poster !== 'N/A' ? (
                                      <img src={movie.Poster} alt={movie.Title} className="w-10 h-14 object-cover rounded" />
                                    ) : (
                                      <div className={`w-10 h-14 ${bgCard} ${borderColor} rounded flex items-center justify-center`}>
                                        <Film className={`h-4 w-4 ${textSecondary}`} />
                                      </div>
                                    )}
                                    <div>
                                      <p className={`${textMain} text-sm font-medium`}>{movie.Title}</p>
                                      <p className={`${textSecondary} text-xs`}>{movie.Year}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className={`p-4 text-center ${textSecondary} text-sm`}>
                                Aucun résultat trouvé
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button 
                        onClick={() => setSearchOpen(true)}
                        className={`p-2 ${textSecondary} ${accentColor} transition-colors rounded-full ${hoverBg}`}
                        title="Rechercher"
                      >
                        <Search className="h-5 w-5" />
                      </button>
                    )}

                    {/* Theme Toggle */}
                    <button
                      onClick={toggleTheme}
                      className={`p-2 ${textSecondary} ${accentColor} transition-colors rounded-full ${hoverBg}`}
                    >
                      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>

                    {/* User Profile */}
                    {user ? (
                      <div className="flex items-center space-x-3">
                        <Link
                          to="/profile"
                          className={`flex items-center space-x-2 ${hoverBg} px-2 py-1 rounded-full transition-colors`}
                        >
                          <div className={`h-8 w-8 rounded-full ${accentBg} flex items-center justify-center`}>
                            <span className="text-sm font-medium text-black">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </Link>
                        <button
                          onClick={logout}
                          className={`p-2 ${textSecondary} hover:text-red-500 transition-colors rounded-full ${hoverBg}`}
                          title="Déconnexion"
                        >
                          <LogOut className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Link
                          to="/login"
                          className={`px-3 py-1.5 text-sm ${textSecondary} ${accentColor} transition-colors`}
                        >
                          Connexion
                        </Link>
                        <Link
                          to="/register"
                          className={`px-3 py-1.5 text-sm ${accentBg} text-black font-medium rounded-full hover:opacity-90 transition-colors`}
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
            <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 ${bgMain} ${borderColor} border-t`}>
              <div className="flex">
                {navigation.map((item) => {
                  if (item.requiresAuth && !user) return null
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex-1 flex flex-col items-center justify-center py-2 px-1 text-xs ${textSecondary} ${accentColor} transition-colors`}
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
