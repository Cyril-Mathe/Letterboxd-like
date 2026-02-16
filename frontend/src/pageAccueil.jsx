import { useContext } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { ThemeContext, AuthContext } from './contexts'
import { Search, Star, Film, TrendingUp, Users, Calendar } from 'lucide-react'
import Searchbar from './searchbar'

const HomePage = () => {
  const { isDark } = useContext(ThemeContext)
  const { user, logout } = useContext(AuthContext)

  // Données simulées pour la démonstration
  const featuredMovies = [
    {
      id: 1,
      title: "Dune: Part Two",
      poster: "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Dune+2",
      rating: 4.2,
      year: 2024,
      genre: "Science Fiction"
    },
    {
      id: 2,
      title: "Oppenheimer",
      poster: "https://via.placeholder.com/300x450/2a2a2a/ffffff?text=Oppenheimer",
      rating: 4.5,
      year: 2023,
      genre: "Biography"
    },
    {
      id: 3,
      title: "The Batman",
      poster: "https://via.placeholder.com/300x450/3a3a3a/ffffff?text=Batman",
      rating: 4.0,
      year: 2022,
      genre: "Action"
    }
  ]

  const popularMovies = [
    { id: 4, title: "Parasite", rating: 4.6, poster: "https://via.placeholder.com/200x300/4a4a4a/ffffff?text=Parasite" },
    { id: 5, title: "Everything Everywhere All at Once", rating: 4.4, poster: "https://via.placeholder.com/200x300/5a5a5a/ffffff?text=EEAAO" },
    { id: 6, title: "The Holdovers", rating: 4.1, poster: "https://via.placeholder.com/200x300/6a6a6a/ffffff?text=Holdovers" },
    { id: 7, title: "Poor Things", rating: 4.3, poster: "https://via.placeholder.com/200x300/7a7a7a/ffffff?text=Poor+Things" },
    { id: 8, title: "Killers of the Flower Moon", rating: 4.2, poster: "https://via.placeholder.com/200x300/8a8a8a/ffffff?text=KOTFM" },
    { id: 9, title: "Anatomy of a Fall", rating: 4.0, poster: "https://via.placeholder.com/200x300/9a9a9a/ffffff?text=Anatomy" }
  ]

  const recentReviews = [
    { user: "FilmBuff92", movie: "Dune: Part Two", rating: 5, comment: "Incroyable suite, la réalisation est magistrale!", time: "2h ago" },
    { user: "Cinephile_Paris", movie: "Oppenheimer", rating: 4, comment: "Nolan à son meilleur niveau.", time: "4h ago" },
    { user: "MovieLover", movie: "The Batman", rating: 4, comment: "Dark et intense, parfait pour les fans de comics.", time: "6h ago" }
  ]

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header avec recherche */}
      <header className={`sticky top-0 z-50 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Film className="h-8 w-8 text-green-500" />
              <h1 className="text-2xl font-bold">CinéConnect</h1>
            </div>

            <Searchbar />

            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher des films, réalisateurs, acteurs..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Bonjour, {user.username}</span>
                  <button onClick={logout} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Connexion
                  </Link>
                  <Link to="/register" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`py-12 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Découvrez les meilleurs films notés par la communauté</h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Partagez vos critiques, découvrez de nouveaux films et connectez-vous avec d'autres cinéphiles
            </p>
          </div>

          {/* Films en vedette */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredMovies.map((movie) => (
              <div key={movie.id} className={`rounded-lg overflow-hidden shadow-lg ${isDark ? 'bg-gray-700' : 'bg-white'} hover:shadow-xl transition-shadow`}>
                <img src={movie.poster} alt={movie.title} className="w-full h-64 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{movie.title}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{movie.year} • {movie.genre}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{movie.rating}</span>
                    </div>
                  </div>
                  <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors">
                    Voir les détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Films Populaires */}
      <section className={`py-12 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-green-500" />
              Films Populaires
            </h3>
            <Link to="/films" className="text-green-500 hover:text-green-600 font-medium">
              Voir tout →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularMovies.map((movie) => (
              <div key={movie.id} className={`rounded-lg overflow-hidden shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'} hover:shadow-lg transition-shadow`}>
                <img src={movie.poster} alt={movie.title} className="w-full h-48 object-cover" />
                <div className="p-3">
                  <h4 className="font-medium text-sm mb-1 truncate">{movie.title}</h4>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="ml-1 text-xs">{movie.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Activité Récente */}
      <section className={`py-12 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-green-500" />
              Activité Récente
            </h3>
            <Link to="/activity" className="text-green-500 hover:text-green-600 font-medium">
              Voir tout →
            </Link>
          </div>

          <div className="space-y-4">
            {recentReviews.map((review, index) => (
              <div key={index} className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} hover:shadow-md transition-shadow`}>
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-300'} flex items-center justify-center`}>
                    <Users className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium">{review.user}</span>
                      <span className="text-sm text-gray-500">a noté</span>
                      <span className="font-medium text-green-500">{review.movie}</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{review.comment}</p>
                    <span className="text-xs text-gray-500">{review.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-200'} border-t`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2025 Letterboxd. Partagez votre passion pour le cinéma.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
