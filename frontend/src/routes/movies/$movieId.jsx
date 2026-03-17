import { createFileRoute } from '@tanstack/react-router'
import { useContext, useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AuthContext, ThemeContext } from '../../contexts'
import { Star, Heart, Eye, ArrowLeft, Calendar, Clock, Film, Users, Trash2 } from 'lucide-react'
import { MovieCardSkeleton } from '../../components/MovieCard'
import { checkIfWatched, markAsWatched, unmarkAsWatched } from '../../lib/api/watchedMovies'

export const Route = createFileRoute('/movies/$movieId')({
  component: FilmDetail,
})

// Clés localStorage
const FAVORITES_KEY = 'cineconnect_favorites'
const WATCHED_KEY = 'cineconnect_watched'
const REVIEWS_KEY = 'cineconnect_reviews'

function FilmDetail() {
  const { movieId } = Route.useParams()
  const { user } = useContext(AuthContext) || { user: null }
  const { isDark } = useContext(ThemeContext) || { isDark: true }
  const apiKey = import.meta.env.VITE_OMDB_API_KEY

  // Dynamic theme colors
  const bgMain = isDark ? 'bg-[#14181c]' : 'bg-gray-100'
  const bgCard = isDark ? 'bg-[#1c2228]' : 'bg-white'
  const borderColor = isDark ? 'border-[#2c3440]' : 'border-gray-200'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-[#9ab]' : 'text-gray-600'
  const accentColor = isDark ? 'text-[#00e054]' : 'text-green-600'
  const accentBg = isDark ? 'bg-[#00e054]' : 'bg-green-600'
  const inputBg = isDark ? 'bg-[#1c2228]' : 'bg-gray-50'
  const hoverBg = isDark ? 'hover:bg-[#2c3440]' : 'hover:bg-gray-100'

  // Charger les favoris depuis localStorage
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem(FAVORITES_KEY)
    return saved ? JSON.parse(saved) : []
  })

  // Charger les films vus depuis localStorage (avant la migration vers BDD)
  const [watched, setWatched] = useState(() => {
    const saved = localStorage.getItem(WATCHED_KEY)
    return saved ? JSON.parse(saved) : []
  })

  // Charger les reviews depuis localStorage
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem(REVIEWS_KEY)
    return saved ? JSON.parse(saved) : []
  })

  // État local pour l'UI
  const [userRating, setUserRating] = useState(0)
  const [userReview, setUserReview] = useState('')
  const [isWatchedInDb, setIsWatchedInDb] = useState(false)
  const [isLoadingWatchStatus, setIsLoadingWatchStatus] = useState(true)

  // Vérifier si ce film est en favori
  const isFavorite = favorites.some(f => f.imdbID === movieId)
  const isWatchedList = watched.some(w => w.imdbID === movieId)

  // Charger le statut "regardé" depuis la BDD au chargement du composant
  useEffect(() => {
    if (user?.id) {
      checkWatchedStatus()
    } else {
      setIsLoadingWatchStatus(false)
    }
  }, [user?.id, movieId])

  const checkWatchedStatus = async () => {
    try {
      const response = await checkIfWatched(user?.id, movieId)
      setIsWatchedInDb(!!response.data)
    } catch (error) {
      console.error('Error checking watched status:', error)
    } finally {
      setIsLoadingWatchStatus(false)
    }
  }

  // Vérifier si l'utilisateur a déjà écrit un commentaire pour ce film
  const userReviewForMovie = reviews.find(r => r.imdbID === movieId && r.userId === user?.id)

  // Sauvegarder les favoris
  const toggleFavorite = () => {
    let newFavorites
    if (isFavorite) {
      newFavorites = favorites.filter(f => f.imdbID !== movieId)
    } else {
      newFavorites = [...favorites, { 
        imdbID: movieId, 
        Title: movie?.Title, 
        Poster: movie?.Poster 
      }]
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites))
    setFavorites(newFavorites)
  }

  // Sauvegarder les films vus
  const toggleWatched = async () => {
    if (!user?.id) {
      alert('Veuillez vous connecter pour marquer un film comme vu')
      return
    }

    try {
      if (isWatchedInDb) {
        // Démarquer comme vu
        await unmarkAsWatched(user.id, movieId)
        setIsWatchedInDb(false)
      } else {
        // Marquer comme vu dans la BDD
        await markAsWatched(user.id, movieId, movie?.Title, movie?.Poster)
        setIsWatchedInDb(true)
      }
    } catch (error) {
      console.error('Error updating watched status:', error)
      alert('Erreur lors de la mise à jour du statut')
    }

    // Mantenir aussi le localStorage pour la compatibilité
    let newWatched
    if (isWatchedList) {
      newWatched = watched.filter(w => w.imdbID !== movieId)
    } else {
      newWatched = [...watched, { 
        imdbID: movieId, 
        Title: movie?.Title, 
        Poster: movie?.Poster,
        date: new Date().toISOString()
      }]
    }
    localStorage.setItem(WATCHED_KEY, JSON.stringify(newWatched))
    setWatched(newWatched)
  }

  // Fetch movie details from OMDb API
  const { isPending, error, data: movie } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: async () => {
      const res = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}&plot=full`)
      const data = await res.json()
      if (data.Response === 'False') {
        throw new Error(data.Error || 'Movie not found')
      }
      return data
    },
    staleTime: 1000 * 60 * 30,
    retry: 2,
  })

  // Mock reviews pour l'exemple (autres utilisateurs)
  const mockReviews = [
    {
      id: 1,
      userId: 'other',
      user: "FilmBuff92",
      avatar: "https://placehold.co/40x40/4a4a4a/ffffff?text=FB",
      rating: 5,
      comment: "Incroyable suite ! Denis Villeneuve a surpassé le premier film. Les effets visuels sont époustouflants et l'histoire est captivante du début à la fin.",
      date: "2024-03-01",
      imdbID: movieId
    },
    {
      id: 2,
      userId: 'other2',
      user: "Cinephile_Paris",
      avatar: "https://placehold.co/40x40/5a5a5a/ffffff?text=CP",
      rating: 4,
      comment: "Une réalisation magistrale. L'adaptation est enfin à la hauteur. L'interprétation est parfaite.",
      date: "2024-03-02",
      imdbID: movieId
    }
  ]

  // Combiner les reviews locales et mock
  const allReviews = [...(userReviewForMovie ? [userReviewForMovie] : []), ...mockReviews]

  const handleRating = (rating) => {
    setUserRating(rating)
  }

  const handleSubmitReview = () => {
    if (!user) {
      alert('Veuillez vous connecter pour laisser un avis')
      return
    }

    if (!isWatchedInDb) {
      alert('Vous devez marquer ce film comme vu avant de laisser un avis')
      return
    }

    if (!userRating || !userReview.trim()) {
      alert('Veuillez donner une note et un commentaire')
      return
    }

    const newReview = {
      id: Date.now(),
      userId: user.id,
      user: user.username,
      avatar: `https://placehold.co/40x40/00e054/000000?text=${user.username.charAt(0).toUpperCase()}`,
      rating: userRating,
      comment: userReview,
      date: new Date().toISOString().split('T')[0],
      imdbID: movieId
    }

    // Sauvegarder dans localStorage
    const updatedReviews = [...reviews.filter(r => !(r.imdbID === movieId && r.userId === user.id)), newReview]
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(updatedReviews))
    setReviews(updatedReviews)

    // Reset form
    setUserReview('')
    setUserRating(0)
  }

  const handleDeleteReview = () => {
    if (!user) return

    const updatedReviews = reviews.filter(r => !(r.imdbID === movieId && r.userId === user.id))
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(updatedReviews))
    setReviews(updatedReviews)
  }

  if (isPending) {
    return (
      <div className={`min-h-screen ${bgMain} ${textMain}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/films" className={`inline-flex items-center ${textSecondary} hover:${accentColor} transition-colors`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux films
          </Link>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <MovieCardSkeleton isDark={isDark} />
            </div>
          </div>
        </div>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00e054]"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen ${bgMain} ${textMain}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/films" className={`inline-flex items-center ${textSecondary} hover:${accentColor} transition-colors`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux films
          </Link>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-red-500">Erreur: {error.message}</p>
        </div>
      </div>
    )
  }

  // Parse genre array
  const genres = movie.Genre ? movie.Genre.split(', ') : []

  return (
    <div className={`min-h-screen ${bgMain} ${textMain} transition-colors duration-300`}>
      {/* Header */}
      <div className={`${borderColor} border-b`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/films" className={`inline-flex items-center ${textSecondary} hover:${accentColor} transition-colors text-sm`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux films
          </Link>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column - Poster & Actions */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              {/* Poster */}
              <div className={`${bgCard} rounded-md overflow-hidden mb-4`}>
                {movie.Poster && movie.Poster !== 'N/A' && (
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className="w-full aspect-[2/3] object-cover"
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={toggleFavorite}
                  className={`w-full flex items-center justify-center px-4 py-2.5 rounded-md transition-all ${
                    isFavorite
                      ? `${accentBg} text-black hover:opacity-90`
                      : `${bgCard} ${textMain} ${hoverBg} border ${borderColor}`
                  }`}
                >
                  <Heart className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                </button>

                <button
                  onClick={toggleWatched}
                  disabled={isLoadingWatchStatus}
                  className={`w-full flex items-center justify-center px-4 py-2.5 rounded-md transition-all ${
                    isWatchedInDb
                      ? `${accentBg} text-black hover:opacity-90`
                      : `${bgCard} ${textMain} ${hoverBg} border ${borderColor}`
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Eye className={`h-5 w-5 mr-2 ${isWatchedInDb ? 'fill-current' : ''}`} />
                  {isLoadingWatchStatus ? 'Chargement...' : (isWatchedInDb ? 'Marquer comme non vu' : 'Marquer comme vu')}
                </button>
              </div>

              {/* Rating Display */}
              {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                <div className={`${bgCard} rounded-md p-4 mt-4`}>
                  <div className="flex items-center justify-center">
                    <Star className={`h-5 w-5 ${accentColor} fill-current mr-2`} />
                    <span className="text-2xl font-bold">{movie.imdbRating}</span>
                    <span className={`${textSecondary} text-sm ml-1`}>/10</span>
                  </div>
                  <p className={`${textSecondary} text-xs text-center mt-1`}>{movie.imdbVotes} votes</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-2">
            {/* Title & Year */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-semibold mb-2">{movie.Title}</h1>
              <div className={`flex flex-wrap items-center gap-4 ${textSecondary} text-sm`}>
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
              </div>
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {genres.map((g, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 ${bgCard} ${textSecondary} text-sm rounded-md hover:${accentColor} border border-transparent hover:border-current transition-colors cursor-pointer`}
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            {movie.Plot && movie.Plot !== 'N/A' && (
              <div className="mb-6">
                <h2 className={`text-lg font-semibold mb-3 ${textSecondary}`}>Synopsis</h2>
                <p className={`${textMain} leading-relaxed`}>
                  {movie.Plot}
                </p>
              </div>
            )}

            {/* Director */}
            {movie.Director && movie.Director !== 'N/A' && (
              <div className="mb-6">
                <h2 className={`text-lg font-semibold mb-2 flex items-center ${textSecondary}`}>
                  <Film className="h-4 w-4 mr-2" />
                  Réalisateur
                </h2>
                <p className={textMain}>{movie.Director}</p>
              </div>
            )}

            {/* Cast */}
            {movie.Actors && movie.Actors !== 'N/A' && (
              <div className="mb-6">
                <h2 className={`text-lg font-semibold mb-2 flex items-center ${textSecondary}`}>
                  <Users className="h-4 w-4 mr-2" />
                  Acteurs
                </h2>
                <p className={textMain}>{movie.Actors}</p>
              </div>
            )}

            {/* Additional Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {movie.Rated && movie.Rated !== 'N/A' && (
                <div className={`${bgCard} rounded-md p-3`}>
                  <span className={`${textSecondary} text-xs block`}>Classification</span>
                  <span className={`${textMain} text-sm`}>{movie.Rated}</span>
                </div>
              )}
              {movie.Language && movie.Language !== 'N/A' && (
                <div className={`${bgCard} rounded-md p-3`}>
                  <span className={`${textSecondary} text-xs block`}>Langue</span>
                  <span className={`${textMain} text-sm`}>{movie.Language}</span>
                </div>
              )}
              {movie.Country && movie.Country !== 'N/A' && (
                <div className={`${bgCard} rounded-md p-3`}>
                  <span className={`${textSecondary} text-xs block`}>Pays</span>
                  <span className={`${textMain} text-sm`}>{movie.Country}</span>
                </div>
              )}
              {movie.Runtime && movie.Runtime !== 'N/A' && (
                <div className={`${bgCard} rounded-md p-3`}>
                  <span className={`${textSecondary} text-xs block`}>Durée</span>
                  <span className={`${textMain} text-sm`}>{movie.Runtime}</span>
                </div>
              )}
            </div>

            {/* Awards */}
            {movie.Awards && movie.Awards !== 'N/A' && (
              <div className="mb-8">
                <h2 className={`text-lg font-semibold mb-2 ${textSecondary}`}>Récompenses</h2>
                <p className={`${textMain} text-sm`}>{movie.Awards}</p>
              </div>
            )}

            {/* Reviews Section */}
            <div className={`${borderColor} border-t pt-8`}>
              <h2 className="text-xl font-semibold mb-6">Avis</h2>

              {/* Write Review - Only show if user hasn't reviewed yet AND has watched the movie */}
              {user && !userReviewForMovie && (
                <>
                  {!isWatchedInDb && !isLoadingWatchStatus ? (
                    <div className={`${bgCard} ${borderColor} border rounded-md p-4 mb-6`}>
                      <p className="text-amber-500 text-sm">
                        ⚠️ Vous devez marquer ce film comme vu avant de laisser un avis
                      </p>
                    </div>
                  ) : (
                    <div className={`${borderColor} border-b pb-6 mb-6`}>
                      <h3 className={`text-sm font-medium ${textSecondary} mb-4`}>Écrire un avis</h3>
                      <div className="mb-4">
                        <div className="flex gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRating(star)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`h-6 w-6 ${
                                  star <= userRating
                                    ? `${accentColor} fill-current`
                                    : isDark ? 'text-[#2c3440]' : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={userReview}
                        onChange={(e) => setUserReview(e.target.value)}
                        placeholder="Partagez votre avis..."
                        className={`w-full px-3 py-2 ${inputBg} ${borderColor} border rounded-md ${textMain} placeholder:${textSecondary} focus:outline-none focus:border-[#00e054] mb-3`}
                        rows={3}
                      />
                      <button
                        onClick={handleSubmitReview}
                        disabled={!userRating || !userReview.trim()}
                        className={`px-4 py-2 ${accentBg} text-black rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium`}
                      >
                        Publier
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* User's existing review - with delete option */}
              {userReviewForMovie && (
                <div className={`${borderColor} border-b pb-6 mb-6 ${bgCard} rounded-md p-4`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={userReviewForMovie.avatar}
                        alt={userReviewForMovie.user}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className={`font-medium text-sm ${textMain}`}>{userReviewForMovie.user} <span className={accentColor}>(Vous)</span></span>
                    </div>
                    <button
                      onClick={handleDeleteReview}
                      className={`p-2 ${textSecondary} hover:text-red-500 transition-colors`}
                      title="Supprimer mon avis"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= userReviewForMovie.rating
                            ? `${accentColor} fill-current`
                            : isDark ? 'text-[#2c3440]' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`${textMain} text-sm`}>{userReviewForMovie.comment}</p>
                  <p className={`${textSecondary} text-xs mt-2`}>{userReviewForMovie.date}</p>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {allReviews.filter(r => r.userId !== user?.id || !user).map((review) => (
                  <div key={review.id} className={`${borderColor} border-b pb-6 last:border-b-0`}>
                    <div className="flex items-start gap-3">
                      <img
                        src={review.avatar}
                        alt={review.user}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-medium text-sm ${textMain}`}>{review.user}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= review.rating
                                    ? `${accentColor} fill-current`
                                    : isDark ? 'text-[#2c3440]' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className={`${textSecondary} text-sm`}>{review.comment}</p>
                        {review.date && <p className={`${textSecondary} text-xs mt-2`}>{review.date}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {allReviews.length === 0 && (
                <p className={`${textSecondary} text-center py-4`}>Aucun avis pour ce film</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
