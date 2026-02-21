import { useContext } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ThemeContext, AuthContext } from './contexts'
import { Star, Film, TrendingUp, Calendar, Loader, Play } from 'lucide-react'
import Footer from './components/Footer'

const HomePage = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const apiKey = import.meta.env.VITE_OMDB_API_KEY

  // Fetch trending movies from OMDb
  const { isPending, error, data: movies } = useQuery({
    queryKey: ['trending'],
    queryFn: async () => {
      const res = await fetch(`https://www.omdbapi.com/?s=movie&type=movie&page=1&apikey=${apiKey}`)
      const data = await res.json()
      if (data.Response === "False") {
        throw new Error(data.Error || 'Failed to fetch movies')
      }
      return data.Search || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  })

  // Select a random movie on each render (changes on refresh)
  const randomMovie = movies && movies.length > 0 
    ? movies[Math.floor(Math.random() * movies.length)]
    : null

  // Get full details for the random movie
  const { data: movieDetails } = useQuery({
    queryKey: ['movie', randomMovie?.imdbID],
    queryFn: async () => {
      if (!randomMovie) return null
      const res = await fetch(`https://www.omdbapi.com/?i=${randomMovie.imdbID}&apikey=${apiKey}`)
      const data = await res.json()
      if (data.Response === "False") {
        return null
      }
      return data
    },
    enabled: !!randomMovie,
    staleTime: 1000 * 60 * 30,
  })

  // Sample recent activity (static for now)
  const recentReviews = [
    { user: "FilmBuff92", movie: "Dune: Part Two", rating: 5, comment: "Incroyable suite, la réalisation est magistrale!", time: "2h ago" },
    { user: "Cinephile_Paris", movie: "Oppenheimer", rating: 4, comment: "Nolan à son meilleur niveau.", time: "4h ago" },
    { user: "MovieLover", movie: "The Batman", rating: 4, comment: "Dark et intense, parfait pour les fans de comics.", time: "6h ago" }
  ]

  const handleViewDetails = () => {
    if (randomMovie) {
      navigate({ to: '/movies/$movieId', params: { movieId: randomMovie.imdbID } })
    }
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#14181c] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00e054]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#14181c] text-white">
      {/* Hero Section - Random Trending Movie */}
      {movieDetails && (
        <div 
          className="relative h-[70vh] min-h-[500px] w-full bg-cover bg-center"
          style={{
            backgroundImage: movieDetails.Poster && movieDetails.Poster !== 'N/A'
              ? `url(${movieDetails.Poster})`
              : 'none'
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#14181c] via-[#14181c]/70 to-transparent" />
          <div className="absolute inset-0 bg-black/40" />

          {/* Hero Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center text-[#00e054] text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Film tendance
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                {movieDetails.Title}
              </h1>

              <div className="flex items-center gap-4 mb-4 text-[#9ab]">
                <span>{movieDetails.Year}</span>
                {movieDetails.Runtime && movieDetails.Runtime !== 'N/A' && (
                  <span>{movieDetails.Runtime}</span>
                )}
                {movieDetails.imdbRating && movieDetails.imdbRating !== 'N/A' && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-[#00e054] fill-current mr-1" />
                    <span className="text-white font-medium">{movieDetails.imdbRating}</span>
                  </div>
                )}
              </div>

              {movieDetails.Plot && movieDetails.Plot !== 'N/A' && (
                <p className="text-[#9ab] text-lg mb-6 line-clamp-3">
                  {movieDetails.Plot}
                </p>
              )}

              <button
                onClick={handleViewDetails}
                className="inline-flex items-center px-6 py-3 bg-[#00e054] text-black font-medium rounded-full hover:bg-[#00cc45] transition-colors"
              >
                <Play className="h-5 w-5 mr-2" />
                Voir les détails
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">
              Bonjour, {user?.username || 'cinéphile'}
            </h2>
            <p className="text-[#9ab]">
              Découvrez les films tendances et partagez vos critiques
            </p>
          </div>

          {/* Browse All Films */}
          <div className="mb-12">
            <Link 
              to="/films" 
              className="inline-flex items-center px-4 py-2 bg-[#00e054] text-black font-medium rounded-full hover:bg-[#00cc45] transition-colors"
            >
              <Film className="h-4 w-4 mr-2" />
              Parcourir tous les films
            </Link>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-lg font-medium flex items-center mb-4">
              <Calendar className="h-5 w-5 mr-2 text-[#00e054]" />
              Activité récente
            </h3>

            <div className="space-y-3">
              {recentReviews.map((review, index) => (
                <div key={index} className="bg-[#1c2228] rounded-md p-4 hover:ring-1 hover:ring-[#2c3440] transition-colors">
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

      <Footer />
    </div>
  )
}

export default HomePage
