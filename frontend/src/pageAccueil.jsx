import { useContext } from 'react'
import { Link } from '@tanstack/react-router'
import { ThemeContext, AuthContext } from './contexts'
import { Search, Star, Film, TrendingUp, Users, Calendar, ChevronRight } from 'lucide-react'
import Searchbar from './searchbar'
import { MovieCard } from './components/MovieCard'

const HomePage = () => {
  const { isDark } = useContext(ThemeContext)
  const { user, logout } = useContext(AuthContext)

  // Données simulées pour la démonstration
  const featuredMovies = [
    {
      id: 'tt0443706', // Dune: Part Two
      title: "Dune: Part Two",
      poster: "https://placehold.co/300x450/1a1a1a/ffffff?text=Dune+2",
      rating: 4.2,
      year: 2024,
      genre: "Science Fiction"
    },
    {
      id: 'tt15398776', // Oppenheimer
      title: "Oppenheimer",
      poster: "https://placehold.co/300x450/2a2a2a/ffffff?text=Oppenheimer",
      rating: 4.5,
      year: 2023,
      genre: "Biography"
    },
    {
      id: 'tt1872190', // The Batman
      title: "The Batman",
      poster: "https://placehold.co/300x450/3a3a3a/ffffff?text=Batman",
      rating: 4.0,
      year: 2022,
      genre: "Action"
    }
  ]

  const popularMovies = [
    { id: 'tt6751668', title: "Parasite", rating: 4.6, poster: "https://www.themoviedb.org/t/p/w1280/7hLSzZX2jROmEXz2aEoh6JKUFy2.jpg" },
    { id: 'tt6710472', title: "Everything Everywhere All at Once", rating: 4.4, poster: "https://cdn.theplaylist.net/wp-content/uploads/2021/12/14171939/everything-everywhere-all-at-once.jpg" },
    { id: 'tt2295039', title: "The Holdovers", rating: 4.1, poster: "https://m.media-amazon.com/images/I/81qdQbsi8oL.jpg" },
    { id: 'tt16958452', title: "Poor Things", rating: 4.3, poster: "https://fr.web.img5.acsta.net/c_310_420/pictures/23/11/28/11/03/2973866.jpg" },
    { id: 'tttt2496760', title: "Killers of the Flower Moon", rating: 4.2, poster: "https://tse3.mm.bing.net/th/id/OIF.jgCQxtNY1VC6rk8sJPz7bw?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 'tt19770238', title: "Anatomy of a Fall", rating: 4.0, poster: "https://blogger.googleusercontent.com/img/a/AVvXsEgcBfGEq-xGdb6IO3xNrdGNxxffPhXMYMkk7sPAqvdaNWqr6bx-jlgKs2AXI7z8NuXPeV8B-zOZvKMBU8c056GHzSh4lQcWj6EjscZRwswDqyKJ5XUMoTkGUloz9-nlF2NWqhIyw6cSNT5UwqsOQiv6yWUijmMAClaezX0GVC-2KGr6JF-5JxImRzIjn6KI=w576-h640" }
  ]

  const recentReviews = [
    { user: "FilmBuff92", movie: "Dune: Part Two", rating: 5, comment: "Incroyable suite, la réalisation est magistrale!", time: "2h ago" },
    { user: "Cinephile_Paris", movie: "Oppenheimer", rating: 4, comment: "Nolan à son meilleur niveau.", time: "4h ago" },
    { user: "MovieLover", movie: "The Batman", rating: 4, comment: "Dark et intense, parfait pour les fans de comics.", time: "6h ago" }
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header avec recherche */}
      <header className={`sticky top-0 z-50 transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Film className="h-8 w-8 text-green-500" />
              <h1 className="text-2xl font-bold">CinéConnect</h1>
            </div>

            <Searchbar />

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
      <section className={`py-12 transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Découvrez les meilleurs films notés par la communauté</h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Partagez vos critiques, découvrez de nouveaux films et connectez-vous avec d'autres cinéphiles
            </p>
          </div>

          {/* Films en vedette - Maintenant cliquables ! */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} showDetailsButton={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Section Films Populaires */}
      <section className={`py-12 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-green-500" />
              Films Populaires
            </h3>
            <Link to="/films" className="flex items-center text-green-500 hover:text-green-600 font-medium transition-colors">
              Voir tout
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} showDetailsButton={false} />
            ))}
          </div>
        </div>
      </section>

      {/* Section Activité Récente */}
      <section className={`py-12 transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-green-500" />
              Activité Récente
            </h3>
            <Link to="/discussion" className="flex items-center text-green-500 hover:text-green-600 font-medium transition-colors">
              Voir tout
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentReviews.map((review, index) => (
              <div key={index} className={`p-4 rounded-lg transition-all duration-300 hover:shadow-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:shadow-md'} cursor-pointer`}>
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}>
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
      <footer className={`py-8 transition-colors duration-300 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-200'} border-t`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2025 CinéConnect. Partagez votre passion pour le cinéma.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
