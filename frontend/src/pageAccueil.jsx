import { useContext, useMemo, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AuthContext } from './contexts'
import { Star, Film, TrendingUp, Calendar, Play, Heart, Search, X } from 'lucide-react'
import Footer from './components/Footer'

const HomePage = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const apiKey = import.meta.env.VITE_OMDB_API_KEY
  const [searchTerm, setSearchTerm] = useState('')

  // Favoris depuis localStorage
  const favorites = JSON.parse(localStorage.getItem('cineconnect_favorites') || '[]')

  // Default movie for hero
  const defaultMovieId = 'tt0469641'
  
  // Fetch trending movies from OMDb
  const { data: movies } = useQuery({
    queryKey: ['trending'],
    queryFn: async () => {
      const searchTerms = ['action', 'drama', 'comedy', 'thriller', 'sci-fi', 'horror', 'romance', 'animation', 'adventure', 'crime']
      const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)]
      const res = await fetch(`https://www.omdbapi.com/?s=${randomTerm}&type=movie&page=1-3&apikey=${apiKey}`)
      const data = await res.json()
      if (data.Response === "False") {
        throw new Error(data.Error || 'Failed to fetch movies')
      }
      return data.Search || []
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })

  // Select a random movie on mount
  const randomMovie = useMemo(() => {
    if (!movies || movies.length === 0) return { imdbID: defaultMovieId }
    return movies[Math.floor(Math.random() * movies.length)]
  }, [movies])

  // Get full details for the random movie
  const { data: movieDetails } = useQuery({
    queryKey: ['movie', randomMovie?.imdbID],
    queryFn: async () => {
      const res = await fetch(`https://www.omdbapi.com/?i=${randomMovie.imdbID}&apikey=${apiKey}&plot=full`)
      const data = await res.json()
      if (data.Response === "False") {
        return null
      }
      return data
    },
    enabled: !!randomMovie,
    staleTime: 1000 * 60 * 30,
  })

  // Search with exact match first, then fallback to broad search
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['movies', 'search', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return null
      
      // First, try exact match using the "type=movie" and check for exact title
      const exactRes = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(searchTerm)}&type=movie&apikey=${apiKey}`)
      const exactData = await exactRes.json()
      
      if (exactData.Response === "True") {
        // Check if title matches exactly (case-insensitive)
        if (exactData.Title.toLowerCase() === searchTerm.toLowerCase()) {
          return { exact: [exactData], broad: [] }
        }
      }
      
      // If no exact match, do broad search
      const broadRes = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&type=movie&page=1&apikey=${apiKey}`)
      const broadData = await broadRes.json()
      
      if (broadData.Response === "False") {
        return { exact: [], broad: [] }
      }
      
      return { exact: [], broad: broadData.Search || [] }
    },
    enabled: searchTerm.length >= 2,
    staleTime: 1000 * 60 * 2,
  })

  // Filter results to show exact matches first
  const displayMovies = useMemo(() => {
    if (searchTerm.length < 2 || !searchResults) return []
    
    // If we have exact matches, show only those
    if (searchResults.exact && searchResults.exact.length > 0) {
      return searchResults.exact
    }
    
    // Otherwise show broad results
    return searchResults.broad || []
  }, [searchResults, searchTerm])

  // Sample recent activity
  const recentReviews = [
    { user: "FilmBuff92", movie: "Dune: Part Two", rating: 5, comment: "Incroyable suite, la réalisation est magistrale!", time: "2h ago" },
    { user: "Cinephile_Paris", movie: "Oppenheimer", rating: 4, comment: "Nolan à son meilleur niveau.", time: "4h ago" },
    { user: "MovieLover", movie: "The Batman", rating: 4, comment: "Dark et intense, parfait pour les fans de comics.", time: "6h ago" }
  ]

  const handleViewDetails = (movieId) => {
    navigate({ to: '/movies/$movieId', params: { movieId } })
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  // Helper to get high quality poster
  const getHighQualityPoster = (posterUrl) => {
    if (!posterUrl || posterUrl === 'N/A') return null
    return posterUrl.replace('SX300', 'SX700').replace('SY500', 'SY1000')
  }

  // Show default while loading
  const displayMovie = movieDetails || {
    Title: randomMovie?.Title || 'The Batman',
    Year: '2022',
    Runtime: '176 min',
    Genre: 'Action, Crime, Drama',
    Plot: 'Batman is forced to emerge from the shadows to track down a serial killer known as The Riddler who is terrorizing Gotham City.',
    imdbRating: '8.0',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtM2M5NS00NmU0LWEwYWItYjMwNDc1NWMxOTkyXkEyXkFqcGc@._V1_SX300.jpg'
  }

  // Only show hero when not searching
  const showHero = searchTerm.length < 2

  return (
    <div className="min-h-screen bg-[#14181c] text-white">
      {/* Hero Section - Only show when not searching */}
      {showHero && (
        <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
          {displayMovie.Poster && displayMovie.Poster !== 'N/A' && (
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(20,24,28,0.2) 0%, rgba(20,24,28,0.6) 50%, rgba(20,24,28,1) 100%), url(${getHighQualityPoster(displayMovie.Poster)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
              }}
            />
          )}
          
          {displayMovie.Poster && displayMovie.Poster !== 'N/A' && (
            <img
              src={getHighQualityPoster(displayMovie.Poster)}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#14181c] via-[#14181c]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#14181c]/70 via-transparent to-[#14181c]/30" />

          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 md:pb-20">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center text-[#00e054] text-sm font-medium bg-[#00e054]/10 px-3 py-1 rounded-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Film tendance
                </span>
                {displayMovie.Genre && displayMovie.Genre !== 'N/A' && (
                  <span className="text-[#9ab] text-sm">
                    {displayMovie.Genre.split(', ')[0]}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 leading-tight tracking-tight">
                {displayMovie.Title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-4 text-[#9ab]">
                {displayMovie.Year && (
                  <span className="text-base">{displayMovie.Year}</span>
                )}
                {displayMovie.Runtime && displayMovie.Runtime !== 'N/A' && (
                  <span className="text-base">{displayMovie.Runtime}</span>
                )}
                {displayMovie.imdbRating && displayMovie.imdbRating !== 'N/A' && (
                  <div className="flex items-center bg-[#00e054]/20 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 text-[#00e054] fill-current mr-2" />
                    <span className="text-white font-bold">{displayMovie.imdbRating}</span>
                    <span className="text-[#9ab] text-xs ml-1">/10</span>
                  </div>
                )}
              </div>

              {displayMovie.Plot && displayMovie.Plot !== 'N/A' && (
                <p className="text-[#9ab] text-base md:text-lg mb-6 line-clamp-2 max-w-xl">
                  {displayMovie.Plot}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleViewDetails(randomMovie?.imdbID || defaultMovieId)}
                  className="inline-flex items-center px-6 py-3 bg-[#00e054] text-black font-semibold rounded-full hover:bg-[#00cc45] transition-all hover:scale-105"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Voir les détails
                </button>
                
                <button
                  onClick={() => navigate({ to: '/films' })}
                  className="inline-flex items-center px-5 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-full hover:bg-white/20 transition-all border border-white/20"
                >
                  <Film className="h-4 w-4 mr-2" />
                  Parcourir les films
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Results Section */}
      {searchTerm.length >= 2 && (
        <div className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Search className="h-5 w-5 text-[#00e054]" />
              <h2 className="text-xl font-semibold">
                Résultats pour "{searchTerm}"
              </h2>
              <button
                onClick={clearSearch}
                className="ml-auto text-[#9ab] hover:text-white text-sm"
              >
                Effacer
              </button>
            </div>

            {isSearching ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00e054]"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {displayMovies.map((movie) => (
                  <div
                    key={movie.imdbID}
                    onClick={() => handleViewDetails(movie.imdbID)}
                    className="bg-[#1c2228] rounded-md overflow-hidden cursor-pointer hover:shadow-lg hover:ring-1 hover:ring-[#00e054] hover:scale-[1.03] transition-all duration-200 group"
                  >
                    <div className="relative aspect-[2/3]">
                      {movie.Poster && movie.Poster !== 'N/A' && (
                        <img
                          src={movie.Poster}
                          alt={movie.Title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-[#00e054] transition-colors">
                        {movie.Title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-[#9ab]">
                        <span>{movie.Year}</span>
                        {movie.Type && (
                          <span className="capitalize">{movie.Type}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {displayMovies.length === 0 && !isSearching && (
              <div className="text-center py-12">
                <Film className="h-12 w-12 text-[#9ab] mx-auto mb-4" />
                <p className="text-[#9ab]">Aucun film trouvé pour "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Welcome Section - Only show when not searching */}
      {showHero && (
        <section className="py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                Bonjour, {user?.username || 'cinéphile'}
              </h2>
              <p className="text-[#9ab]">
                Découvrez les films tendances et partagez vos critiques
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <Link 
                to="/films" 
                className="inline-flex items-center px-4 py-2 bg-[#00e054] text-black font-medium rounded-full hover:bg-[#00cc45] transition-colors text-sm"
              >
                <Film className="h-4 w-4 mr-2" />
                Parcourir tous les films
              </Link>
            </div>

            {favorites.length > 0 && (
              <div className="mb-10">
                <h3 className="text-base font-medium flex items-center mb-4">
                  <Heart className="h-5 w-5 mr-2 text-[#00e054]" />
                  Mes Favoris
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {favorites.slice(0, 6).map((fav) => (
                    <div
                      key={fav.imdbID}
                      onClick={() => handleViewDetails(fav.imdbID)}
                      className="cursor-pointer group"
                    >
                      <div className="aspect-[2/3] rounded-md overflow-hidden mb-2">
                        {fav.Poster && fav.Poster !== 'N/A' ? (
                          <img
                            src={fav.Poster}
                            alt={fav.Title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#1c2228] flex items-center justify-center">
                            <Film className="h-6 w-6 text-[#9ab]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-[#9ab] group-hover:text-[#00e054] transition-colors truncate">
                        {fav.Title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-base font-medium flex items-center mb-4">
                <Calendar className="h-5 w-5 mr-2 text-[#00e054]" />
                Activité récente
              </h3>

              <div className="space-y-2">
                {recentReviews.map((review, index) => (
                  <div key={index} className="bg-[#1c2228] rounded-md p-3 hover:ring-1 hover:ring-[#2c3440] transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#00e054] flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-black">
                          {review.user.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{review.user}</span>
                          <span className="text-[#9ab] text-xs">→</span>
                          <span className="text-[#00e054] text-sm font-medium">{review.movie}</span>
                          <div className="flex items-center ml-auto">
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
                        <p className="text-[#9ab] text-sm mb-1">{review.comment}</p>
                        <span className="text-[#9ab] text-xs">{review.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}

export default HomePage
