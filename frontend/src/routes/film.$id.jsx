import { createFileRoute } from '@tanstack/react-router'
import { useContext, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ThemeContext, AuthContext } from '../contexts'
import { Star, Heart, Eye, MessageCircle, ArrowLeft, Calendar, Clock, Film } from 'lucide-react'

export const Route = createFileRoute('/film/$id')({
  component: FilmDetail,
})

function FilmDetail() {
  const { id } = Route.useParams()
  const { isDark } = useContext(ThemeContext)
  const { user } = useContext(AuthContext)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isWatched, setIsWatched] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [userReview, setUserReview] = useState('')

  // Données simulées du film (normalement récupérées depuis une API)
  const movie = {
    id: parseInt(id),
    title: "Dune: Part Two",
    poster: "https://via.placeholder.com/600x900/1a1a1a/ffffff?text=Dune+2",
    backdrop: "https://via.placeholder.com/1200x600/2a2a2a/ffffff?text=Dune+Backdrop",
    rating: 4.2,
    year: 2024,
    genre: ["Science-Fiction", "Action", "Drame"],
    duration: "166 min",
    director: "Denis Villeneuve",
    synopsis: "Paul Atreides s'unit à Chani et aux Fremen pour prendre sa revanche contre ceux qui ont détruit sa famille. Confronté à un choix entre l'amour de sa vie et le destin de l'univers connu, il doit se rendre sur la planète interdite d'Arrakis où il mettra en œuvre sa vengeance la plus impitoyable.",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Oscar Isaac", "Jason Momoa"],
    reviews: [
      {
        id: 1,
        user: "FilmBuff92",
        avatar: "https://via.placeholder.com/40x40/4a4a4a/ffffff?text=FB",
        rating: 5,
        comment: "Incroyable suite ! Denis Villeneuve a surpassé le premier film. Les effets visuels sont époustouflants et l'histoire est captivante du début à la fin.",
        date: "2024-03-01"
      },
      {
        id: 2,
        user: "Cinephile_Paris",
        avatar: "https://via.placeholder.com/40x40/5a5a5a/ffffff?text=CP",
        rating: 4,
        comment: "Une réalisation magistrale. L'adaptation de Dune est enfin à la hauteur du livre. Timothée Chalamet est parfait dans le rôle de Paul.",
        date: "2024-03-02"
      },
      {
        id: 3,
        user: "MovieLover",
        avatar: "https://via.placeholder.com/40x40/6a6a4a/ffffff?text=ML",
        rating: 4,
        comment: "Visuellement superbe, mais l'histoire pourrait être plus accessible pour les néophytes. Les scènes d'action sont mémorables.",
        date: "2024-03-03"
      }
    ]
  }

  const handleRating = (rating) => {
    setUserRating(rating)
  }

  const handleSubmitReview = () => {
    // Simulation d'ajout d'avis
    console.log('Avis soumis:', { rating: userRating, review: userReview })
    setUserReview('')
    setUserRating(0)
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Bouton retour */}
      <div className="sticky top-0 z-50 bg-black bg-opacity-75 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/films"
            className="inline-flex items-center text-white hover:text-green-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux films
          </Link>
        </div>
      </div>

      {/* Bannière du film */}
      <div className="relative">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-32 md:w-48 rounded-lg shadow-2xl"
              />
              <div className="flex-1">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{movie.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-white text-sm md:text-base mb-4">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {movie.year}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {movie.duration}
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 fill-current text-yellow-400" />
                    <span className="font-medium">{movie.rating}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genre.map((g, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded-full"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations et actions */}
          <div className="lg:col-span-2">
            {/* Synopsis */}
            <div className={`rounded-lg p-6 mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {movie.synopsis}
              </p>
            </div>

            {/* Distribution */}
            <div className={`rounded-lg p-6 mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className="text-2xl font-bold mb-4">Distribution</h2>
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">Réalisateur</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{movie.director}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Acteurs principaux</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${
                        isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Avis utilisateurs */}
            <div className={`rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className="text-2xl font-bold mb-6">Avis des utilisateurs</h2>

              {/* Écrire un avis (si connecté) */}
              {user && (
                <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} pb-6 mb-6`}>
                  <h3 className="text-lg font-semibold mb-4">Écrire un avis</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Votre note</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= userRating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Votre avis</label>
                    <textarea
                      value={userReview}
                      onChange={(e) => setUserReview(e.target.value)}
                      placeholder="Partagez votre avis sur ce film..."
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-green-500`}
                      rows={4}
                    />
                  </div>
                  <button
                    onClick={handleSubmitReview}
                    disabled={!userRating || !userReview.trim()}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Publier l'avis
                  </button>
                </div>
              )}

              {/* Liste des avis */}
              <div className="space-y-6">
                {movie.reviews.map((review) => (
                  <div key={review.id} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} pb-6 last:border-b-0`}>
                    <div className="flex items-start space-x-4">
                      <img
                        src={review.avatar}
                        alt={review.user}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{review.user}</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {new Date(review.date).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar avec actions */}
          <div className="lg:col-span-1">
            <div className={`sticky top-24 rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className="text-lg font-bold mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-colors ${
                    isFavorite
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : `border-2 ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`
                  }`}
                >
                  <Heart className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                </button>

                <button
                  onClick={() => setIsWatched(!isWatched)}
                  className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-colors ${
                    isWatched
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : `border-2 ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`
                  }`}
                >
                  <Eye className={`h-5 w-5 mr-2 ${isWatched ? 'fill-current' : ''}`} />
                  {isWatched ? 'Marquer comme non vu' : 'Marquer comme vu'}
                </button>

                <button
                  className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-colors border-2 ${
                    isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Écrire un avis
                </button>
              </div>

              {/* Statistiques */}
              <div className={`mt-6 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h4 className="font-semibold mb-3">Statistiques</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Note moyenne:</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{movie.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Nombre d'avis:</span>
                    <span className="font-medium">{movie.reviews.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
