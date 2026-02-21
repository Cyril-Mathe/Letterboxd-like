import { createFileRoute } from '@tanstack/react-router'
import { useContext, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ThemeContext, AuthContext } from '../../contexts'
import { Star, Heart, Eye, ArrowLeft, Calendar, Clock, Film, Users, Loader } from 'lucide-react'
import { ErrorMessage } from '../../components/Loader'
import { MovieCardSkeleton } from '../../components/MovieCard'

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
    staleTime: 1000 * 60 * 30,
    retry: 2,
  })

  // Mock reviews
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
      <div className="min-h-screen bg-[#14181c]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/films" className="inline-flex items-center text-[#9ab] hover:text-[#00e054] transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux films
          </Link>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <MovieCardSkeleton />
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
      <div className="min-h-screen bg-[#14181c]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/films" className="inline-flex items-center text-[#9ab] hover:text-[#00e054] transition-colors">
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
    <div className="min-h-screen bg-[#14181c] text-white">
      {/* Header */}
      <div className="border-b border-[#2c3440]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/films" className="inline-flex items-center text-[#9ab] hover:text-[#00e054] transition-colors text-sm">
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
              <div className="bg-[#1c2228] rounded-md overflow-hidden mb-4">
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
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-full flex items-center justify-center px-4 py-2 rounded-md transition-all ${
                    isFavorite
                      ? 'bg-[#00e054] text-black hover:bg-[#00cc45]'
                      : 'bg-[#1c2228] text-white hover:bg-[#2c3440] border border-[#2c3440]'
                  }`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Retirer' : 'Favoris'}
                </button>

                <button
                  onClick={() => setIsWatched(!isWatched)}
                  className={`w-full flex items-center justify-center px-4 py-2 rounded-md transition-all ${
                    isWatched
                      ? 'bg-[#00e054] text-black hover:bg-[#00cc45]'
                      : 'bg-[#1c2228] text-white hover:bg-[#2c3440] border border-[#2c3440]'
                  }`}
                >
                  <Eye className={`h-4 w-4 mr-2 ${isWatched ? 'fill-current' : ''}`} />
                  {isWatched ? 'Vu' : 'À voir'}
                </button>
              </div>

              {/* Rating Display */}
              {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                <div className="mt-4 bg-[#1c2228] rounded-md p-4">
                  <div className="flex items-center justify-center">
                    <Star className="h-5 w-5 text-[#00e054] fill-current mr-2" />
                    <span className="text-2xl font-bold">{movie.imdbRating}</span>
                    <span className="text-[#9ab] text-sm ml-1">/10</span>
                  </div>
                  <p className="text-[#9ab] text-xs text-center mt-1">{movie.imdbVotes} votes</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-2">
            {/* Title & Year */}
            <div className="mb-6">
              <h1 className="text-3xl font-semibold mb-2">{movie.Title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-[#9ab] text-sm">
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
                    className="px-3 py-1 bg-[#1c2228] text-[#9ab] text-sm rounded-md hover:text-[#00e054] hover:border-[#00e054] border border-transparent transition-colors cursor-pointer"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            {movie.Plot && movie.Plot !== 'N/A' && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3 text-[#9ab]">Synopsis</h2>
                <p className="text-white leading-relaxed">
                  {movie.Plot}
                </p>
              </div>
            )}

            {/* Director */}
            {movie.Director && movie.Director !== 'N/A' && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 flex items-center text-[#9ab]">
                  <Film className="h-4 w-4 mr-2" />
                  Réalisateur
                </h2>
                <p className="text-white">{movie.Director}</p>
              </div>
            )}

            {/* Cast */}
            {movie.Actors && movie.Actors !== 'N/A' && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 flex items-center text-[#9ab]">
                  <Users className="h-4 w-4 mr-2" />
                  Acteurs
                </h2>
                <p className="text-white">{movie.Actors}</p>
              </div>
            )}

            {/* Additional Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {movie.Rated && movie.Rated !== 'N/A' && (
                <div className="bg-[#1c2228] rounded-md p-3">
                  <span className="text-[#9ab] text-xs block">Classification</span>
                  <span className="text-white text-sm">{movie.Rated}</span>
                </div>
              )}
              {movie.Language && movie.Language !== 'N/A' && (
                <div className="bg-[#1c2228] rounded-md p-3">
                  <span className="text-[#9ab] text-xs block">Langue</span>
                  <span className="text-white text-sm">{movie.Language}</span>
                </div>
              )}
              {movie.Country && movie.Country !== 'N/A' && (
                <div className="bg-[#1c2228] rounded-md p-3">
                  <span className="text-[#9ab] text-xs block">Pays</span>
                  <span className="text-white text-sm">{movie.Country}</span>
                </div>
              )}
              {movie.Runtime && movie.Runtime !== 'N/A' && (
                <div className="bg-[#1c2228] rounded-md p-3">
                  <span className="text-[#9ab] text-xs block">Durée</span>
                  <span className="text-white text-sm">{movie.Runtime}</span>
                </div>
              )}
            </div>

            {/* Awards */}
            {movie.Awards && movie.Awards !== 'N/A' && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2 text-[#9ab]">Récompenses</h2>
                <p className="text-white text-sm">{movie.Awards}</p>
              </div>
            )}

            {/* Reviews Section */}
            <div className="border-t border-[#2c3440] pt-8">
              <h2 className="text-xl font-semibold mb-6">Avis</h2>

              {/* Write Review */}
              {user && (
                <div className="border-b border-[#2c3440] pb-6 mb-6">
                  <h3 className="text-sm font-medium text-[#9ab] mb-4">Écrire un avis</h3>
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
                                ? 'text-[#00e054] fill-current'
                                : 'text-[#2c3440]'
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
                    className="w-full px-3 py-2 bg-[#1c2228] border border-[#2c3440] rounded-md text-white placeholder-[#9ab] focus:outline-none focus:border-[#00e054] mb-3"
                    rows={3}
                  />
                  <button
                    onClick={handleSubmitReview}
                    disabled={!userRating || !userReview.trim()}
                    className="px-4 py-2 bg-[#00e054] text-black rounded-md hover:bg-[#00cc45] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    Publier
                  </button>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-[#2c3440] pb-6 last:border-b-0">
                    <div className="flex items-start gap-3">
                      <img
                        src={review.avatar}
                        alt={review.user}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{review.user}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= review.rating
                                    ? 'text-[#00e054] fill-current'
                                    : 'text-[#2c3440]'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-[#9ab] text-sm">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
