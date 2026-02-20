import { createFileRoute } from '@tanstack/react-router'
import { useContext, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ThemeContext, AuthContext } from '../../contexts'
import { Star, Heart, Eye, MessageCircle, ArrowLeft, Calendar, Clock, Film, Users, Loader } from 'lucide-react'
import { ErrorMessage } from '../../components/Loader'
import { MovieCardSkeleton, MovieCard } from '../../components/MovieCard'

export const Route = createFileRoute('/movies/$movieId')({
  component: FilmDetail,
})

function FilmDetail() {
  const { movieId } = Route.useParams()
  const { isDark } = useContext(ThemeContext)
  const { user } = useContext(AuthContext)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isWatched, setIsWatched] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [userReview, setUserReview] = useState('')
  
  const apiKey = import.meta.env.VITE_OMDB_API_KEY

  // Fetch movie details from OMDb API
  const { isPending, error, data: movie } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: async () => {
      const res = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`)
      const data = await res.json()
      if (data.Response === 'False') {
        throw new Error(data.Error || 'Movie not found')
      }
      return data
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
  })

  // Données simulées pour les reviews
  const reviews = [
    {
      id: 1,
      user: "FilmBuff92",
      avatar: "https://placehold.co/40x40/4a4a4a/ffffff?text=FB",
      rating: 5,
      comment: "Incroyable suite ! Denis Villeneuve a surpassé le premier film. Les effets visuels sont époustouflants et l'histoire est captivante du début à la fin.",
      date: "2024-03-01"
    },
    {
      id: 2,
      user: "Cinephile_Paris",
      avatar: "https://placehold.co/40x40/5a5a5a/ffffff?text=CP",
      rating: 4,
      comment: "Une réalisation magistrale. L'adaptation est enfin à la hauteur. L'interprétation est parfaite.",
      date: "2024-03-02"
    },
    {
      id: 3,
      user: "MovieLover",
      avatar: "https://placehold.co/40x40/6a6a4a/ffffff?text=ML",
      rating: 4,
      comment: "Visuellement superb, mais l'histoire pourrait être plus accessible pour les néophytes.",
      date: "2024-03-03"
    }
  ]

  const handleRating = (rating) => {
    setUserRating(rating)
  }

  const handleSubmitReview = () => {
    console.log('Avis soumis:', { rating: userRating, review: userReview })
    setUserReview('')
    setUserRating(0)
  }

  if (isPending) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="sticky top-0 z-50 bg-black/75 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link to="/films" className="inline-flex items-center text-white hover:text-green-400 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux films
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <MovieCardSkeleton />
            </div>
          </div>
        </div>
        <div className="flex justify-center py-12">
          <Loader message="Chargement des détails du film..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="sticky top-0 z-50 bg-black/75 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link to="/films" className="inline-flex items-center text-white hover:text-green-400 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux films
            </Link>
          </div>
        </div>
        <ErrorMessage message={error.message} />
      </div>
    )
  }

  // Parse genre array
  const genres = movie.Genre ? movie.Genre.split(', ') : []

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-black/75 backdrop-blur-sm">
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
        {movie.Poster && movie.Poster !== 'N/A' && (
          <>
            <img
              src={movie.Poster.replace('._V1_', '._V1_').replace('SX300', 'SX1200')}
              alt={movie.Title}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              {movie.Poster && movie.Poster !== 'N/A' && (
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="w-32 md:w-48 rounded-lg shadow-2xl"
                />
              )}
              <div className="flex-1">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{movie.Title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-white text-sm md:text-base mb-4">
                  {movie.Year && (
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {movie.Year}
                    </span>
                  )}
                  {movie.Runtime && movie.Runtime !== 'N/A' && (
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {movie.Runtime}
                    </span>
                  )}
                  {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 fill-current text-yellow-400" />
                      <span className="font-medium">{movie.imdbRating}/10</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {genres.map((g, index) => (
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
            {movie.Plot && movie.Plot !== 'N/A' && (
              <div className={`rounded-lg p-6 mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 hover:shadow-xl`}>
                <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
                <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {movie.Plot}
                </p>
              </div>
            )}

            {/* Distribution */}
            {(movie.Director || movie.Actors) && (
              <div className={`rounded-lg p-6 mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 hover:shadow-xl`}>
                <h2 className="text-2xl font-bold mb-4">Distribution</h2>
                {movie.Director && movie.Director !== 'N/A' && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2 flex items-center">
                      <Film className="w-5 h-5 mr-2 text-green-500" />
                      Réalisateur
                    </h3>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{movie.Director}</p>
                  </div>
                )}
                {movie.Actors && movie.Actors !== 'N/A' && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-green-500" />
                      Acteurs
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.Actors.split(', ').map((actor, index) => (
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
                )}
              </div>
            )}

            {/* Informations supplémentaires */}
            {(movie.Rated || movie.Writer || movie.Language || movie.Country || movie.Awards) && (
              <div className={`rounded-lg p-6 mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 hover:shadow-xl`}>
                <h2 className="text-2xl font-bold mb-4">Informations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {movie.Rated && movie.Rated !== 'N/A' && (
                    <div>
                      <span className="font-medium">Classification:</span>
                      <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{movie.Rated}</span>
                    </div>
                  )}
                  {movie.Writer && movie.Writer !== 'N/A' && (
                    <div>
                      <span className="font-medium">Scénario:</span>
                      <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{movie.Writer}</span>
                    </div>
                  )}
                  {movie.Language && movie.Language !== 'N/A' && (
                    <div>
                      <span className="font-medium">Langue:</span>
                      <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{movie.Language}</span>
                    </div>
                  )}
                  {movie.Country && movie.Country !== 'N/A' && (
                    <div>
                      <span className="font-medium">Pays:</span>
                      <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{movie.Country}</span>
                    </div>
                  )}
                  {movie.Awards && movie.Awards !== 'N/A' && (
                    <div className="md:col-span-2">
                      <span className="font-medium">Récompenses:</span>
                      <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{movie.Awards}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Avis utilisateurs */}
            <div className={`rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 hover:shadow-xl`}>
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
                          className="focus:outline-none transition-transform hover:scale-110"
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
                      className={`w-full px-3 py-2 border rounded-lg transition-colors ${
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
                {reviews.map((review) => (
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
            <div className={`sticky top-24 rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 hover:shadow-xl`}>
              <h3 className="text-lg font-bold mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
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
                  className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    isWatched
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : `border-2 ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`
                  }`}
                >
                  <Eye className={`h-5 w-5 mr-2 ${isWatched ? 'fill-current' : ''}`} />
                  {isWatched ? 'Marquer comme non vu' : 'Marquer comme vu'}
                </button>

                <button
                  className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 border-2 ${
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
                  {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                    <div className="flex justify-between">
                      <span>Note IMDb:</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-medium">{movie.imdbRating}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Nombre d'avis:</span>
                    <span className="font-medium">{reviews.length}</span>
                  </div>
                  {movie.imdbVotes && movie.imdbVotes !== 'N/A' && (
                    <div className="flex justify-between">
                      <span>Votes:</span>
                      <span className="font-medium">{movie.imdbVotes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
