import { useContext, useMemo, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AuthContext, ThemeContext } from '../lib/fonctions/contexts'
import { Star, Film, TrendingUp, Calendar, Play, Heart, Search } from 'lucide-react'
import Footer from './Footer'

const HomePage = () => {
  const { user } = useContext(AuthContext)
  const { isDark } = useContext(ThemeContext)
  const navigate = useNavigate()
  const apiKey = import.meta.env.VITE_OMDB_API_KEY
  const [searchTerm, setSearchTerm] = useState('')

  // Theme-based classes
  const bgMain = isDark ? 'bg-[#14181c]' : 'bg-gray-50'
  const bgCard = isDark ? 'bg-[#1c2228]' : 'bg-white'
  const borderColor = isDark ? 'border-[#2c3440]' : 'border-gray-200'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-[#9ab]' : 'text-gray-600'
  const accentColor = isDark ? 'text-[#00e054]' : 'text-green-600'
  const accentBg = isDark ? 'bg-[#00e054]' : 'bg-green-600'
  const accentBgLight = isDark ? 'bg-[#00e054]/10' : 'bg-green-50'
  const hoverBg = isDark ? 'hover:bg-[#2c3440]' : 'hover:bg-gray-100'
  const inputBg = isDark ? 'bg-[#1c2228]' : 'bg-white'

  const favorites = JSON.parse(localStorage.getItem('cineconnect_favorites') || '[]')
  const defaultMovieId = 'tt0469641'
  
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

  const randomMovie = useMemo(() => {
    if (!movies || movies.length === 0) return { imdbID: defaultMovieId }
    return movies[Math.floor(Math.random() * movies.length)]
  }, [movies])

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

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['movies', 'search', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return null
      
      const exactRes = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(searchTerm)}&type=movie&apikey=${apiKey}`)
      const exactData = await exactRes.json()
      
      if (exactData.Response === "True") {
        if (exactData.Title.toLowerCase() === searchTerm.toLowerCase()) {
          return { exact: [exactData], broad: [] }
        }
      }
      
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

  const displayMovies = useMemo(() => {
    if (searchTerm.length < 2 || !searchResults) return []
    if (searchResults.exact && searchResults.exact.length > 0) {
      return searchResults.exact
    }
    return searchResults.broad || []
  }, [searchResults, searchTerm])

  const { data: allReviews } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/v1/reviews`)
      if (!res.ok) throw new Error('Failed to fetch reviews')
      const data = await res.json()
      return data.data || []
    },
    staleTime: 1000 * 60 * 1,
    retry: 1,
  })

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'recently'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const recentReviews = useMemo(() => {
    if (!allReviews) return []
    return allReviews
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map(review => ({
        user: review.username || 'Anonymous',
        movie: review.title || 'Unknown',
        rating: review.rating || 0,
        comment: review.comment || '',
        time: formatTimeAgo(review.createdAt),
        createdAt: review.createdAt
      }))
  }, [allReviews])

  const handleViewDetails = (movieId) => {
    navigate({ to: '/movies/$movieId', params: { movieId } })
  }

  const getHighQualityPoster = (posterUrl) => {
    if (!posterUrl || posterUrl === 'N/A') return null
    return posterUrl.replace('SX300', 'SX700').replace('SY500', 'SY1000')
  }

  const displayMovie = movieDetails || {
    Title: randomMovie?.Title || 'The Batman',
    Year: '2022',
    Runtime: '176 min',
    Genre: 'Action, Crime, Drama',
    Plot: 'Batman is forced to emerge from the shadows to track down a serial killer known as The Riddler who is terrorizing Gotham City.',
    imdbRating: '8.0',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtM2M5NS00NmU0LWEwYWItYjMwNDc1NWMxOTkyXkEyXkFqcGc@._V1_SX300.jpg'
  }

  const showHero = searchTerm.length < 2
  const heroGradient = isDark ? 'from-[#14181c]/70 via-[#14181c]/50 to-[#14181c]' : 'from-gray-50/70 via-gray-50/50 to-gray-50'

  return (
    <div className={`min-h-screen ${bgMain} ${textMain} transition-colors duration-300`}>
      {showHero && (
        <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
          {displayMovie.Poster && displayMovie.Poster !== 'N/A' && (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(20,24,28,0.2) 0%, rgba(20,24,28,0.6) 50%, rgba(20,24,28,1) 100%), url(${getHighQualityPoster(displayMovie.Poster)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                }}
              />
              <img src={getHighQualityPoster(displayMovie.Poster)} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </>
          )}

          <div className={`absolute inset-0 bg-gradient-to-t ${heroGradient}`} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/30" />

          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 md:pb-20">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-3">
                <span className={`flex items-center ${accentColor} text-sm font-medium ${accentBgLight} px-3 py-1 rounded-full`}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Film tendance
                </span>
                {displayMovie.Genre && displayMovie.Genre !== 'N/A' && (
                  <span className={`${textSecondary} text-sm`}>{displayMovie.Genre.split(', ')[0]}</span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 leading-tight tracking-tight">{displayMovie.Title}</h1>

              <div className={`flex flex-wrap items-center gap-3 mb-4 ${textSecondary}`}>
                {displayMovie.Year && <span className="text-base">{displayMovie.Year}</span>}
                {displayMovie.Runtime && displayMovie.Runtime !== 'N/A' && <span className="text-base">{displayMovie.Runtime}</span>}
                {displayMovie.imdbRating && displayMovie.imdbRating !== 'N/A' && (
                  <div className={`flex items-center ${accentBgLight} px-3 py-1 rounded-full`}>
                    <Star className={`h-4 w-4 ${accentColor} fill-current mr-2`} />
                    <span className={`${textMain} font-bold`}>{displayMovie.imdbRating}</span>
                    <span className={`${textSecondary} text-xs ml-1`}>/10</span>
                  </div>
                )}
              </div>

              {displayMovie.Plot && displayMovie.Plot !== 'N/A' && (
                <p className={`${textSecondary} text-base md:text-lg mb-6 line-clamp-2 max-w-xl`}>{displayMovie.Plot}</p>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleViewDetails(randomMovie?.imdbID || defaultMovieId)}
                  className={`inline-flex items-center px-6 py-3 ${accentBg} text-black font-semibold rounded-full hover:opacity-90 transition-all hover:scale-105`}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Voir les détails
                </button>
                
                <button
                  onClick={() => navigate({ to: '/films' })}
                  className={`inline-flex items-center px-5 py-3 bg-white/10 backdrop-blur-sm ${textMain} font-medium rounded-full hover:bg-white/20 transition-all border border-white/20`}
                >
                  <Film className="h-4 w-4 mr-2" />
                  Parcourir les films
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {searchTerm.length >= 2 && (
        <div className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Search className={`h-5 w-5 ${accentColor}`} />
              <h2 className="text-xl font-semibold">Résultats pour "{searchTerm}"</h2>
              <button onClick={() => setSearchTerm('')} className={`ml-auto ${textSecondary} hover:${textMain} text-sm`}>Effacer</button>
            </div>

            {isSearching ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00e054]"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {displayMovies.map((movie) => (
                  <div key={movie.imdbID} onClick={() => handleViewDetails(movie.imdbID)} className={`${bgCard} rounded-md overflow-hidden cursor-pointer hover:shadow-lg hover:ring-1 hover:ring-[#00e054] hover:scale-[1.03] transition-all duration-200 group`}>
                    <div className="relative aspect-[2/3]">
                      {movie.Poster && movie.Poster !== 'N/A' && <img src={movie.Poster} alt={movie.Title} className="w-full h-full object-cover" loading="lazy" />}
                    </div>
                    <div className="p-3">
                      <h3 className={`font-medium text-sm mb-1 line-clamp-2 group-hover:${accentColor} transition-colors`}>{movie.Title}</h3>
                      <div className={`flex items-center justify-between text-xs ${textSecondary}`}>
                        <span>{movie.Year}</span>
                        {movie.Type && <span className="capitalize">{movie.Type}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {displayMovies.length === 0 && !isSearching && (
              <div className="text-center py-12">
                <Film className={`h-12 w-12 ${textSecondary} mx-auto mb-4`} />
                <p className={textSecondary}>Aucun film trouvé pour "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showHero && (
        <section className="py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Bonjour, {user?.username || 'cinéphile'}</h2>
              <p className={textSecondary}>Découvrez les films tendances et partagez vos critiques</p>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <Link to="/films" className={`inline-flex items-center px-4 py-2 ${accentBg} text-black font-medium rounded-full hover:opacity-90 transition-colors text-sm`}>
                <Film className="h-4 w-4 mr-2" />
                Parcourir tous les films
              </Link>
            </div>

            {favorites.length > 0 && (
              <div className="mb-10">
                <h3 className="text-base font-medium flex items-center mb-4">
                  <Heart className={`h-5 w-5 mr-2 ${accentColor}`} />
                  Mes Favoris
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {favorites.slice(0, 6).map((fav) => (
                    <div key={fav.imdbID} onClick={() => handleViewDetails(fav.imdbID)} className="cursor-pointer group">
                      <div className="aspect-[2/3] rounded-md overflow-hidden mb-2">
                        {fav.Poster && fav.Poster !== 'N/A' ? (
                          <img src={fav.Poster} alt={fav.Title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className={`w-full h-full ${bgCard} flex items-center justify-center`}>
                            <Film className={`h-6 w-6 ${textSecondary}`} />
                          </div>
                        )}
                      </div>
                      <p className={`text-xs ${textSecondary} group-hover:${accentColor} transition-colors truncate`}>{fav.Title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-base font-medium flex items-center mb-4">
                <Calendar className={`h-5 w-5 mr-2 ${accentColor}`} />
                Activité récente
              </h3>

              <div className="space-y-2">
                {recentReviews.map((review, index) => (
                  <div key={index} className={`${bgCard} rounded-md p-3 ${hoverBg} transition-colors`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full ${accentBg} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-xs font-medium text-black">{review.user.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{review.user}</span>
                          <span className={`${textSecondary} text-xs`}>→</span>
                          <span className={`${accentColor} text-sm font-medium`}>{review.movie}</span>
                          <div className="flex items-center ml-auto">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`h-3 w-3 ${star <= review.rating ? `${accentColor} fill-current` : isDark ? 'text-[#2c3440]' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <p className={`${textSecondary} text-sm mb-1`}>{review.comment}</p>
                        <span className={`${textSecondary} text-xs`}>{review.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer isDark={isDark} />
    </div>
  )
}

export default HomePage
