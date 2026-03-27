import { createFileRoute } from '@tanstack/react-router'
import { useContext, useState } from 'react'
import { ThemeContext } from '../lib/fonctions/contexts'
import { useQuery } from '@tanstack/react-query'
import { Search, Play } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/films')({
  component: Films,
})

// Movie Card Component
function MovieCard({ movie, isDark }) {
  const title = movie.Title || movie.title
  const poster = movie.Poster || movie.poster
  const rating = movie.imdbRating || movie.rating
  const year = movie.Year || movie.year
  const id = movie.imdbID || movie.id

  if (!poster || poster === 'N/A') return null

  return (
    <Link to="/movies/$movieId" params={{ movieId: id }} className="block group flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px]">
      <div className="bg-[#1c2228] rounded-md overflow-hidden transition-all duration-200 hover:shadow-lg hover:ring-1 hover:ring-[#00e054] hover:scale-105 cursor-pointer">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img 
            src={poster} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[#00e054] flex items-center justify-center">
              <Play className="h-6 w-6 text-black ml-1" fill="currentColor" />
            </div>
          </div>
          {rating && rating !== 'N/A' && (
            <div className="absolute top-2 right-2 bg-black/75 text-white px-2 py-0.5 rounded text-xs font-medium flex items-center">
              <span className="text-yellow-400 mr-1">★</span>
              {rating}
            </div>
          )}
        </div>
        
        <div className="p-2">
          <h3 className="font-medium text-xs mb-1 line-clamp-2 text-white group-hover:text-[#00e054] transition-colors">
            {title}
          </h3>
          <div className="flex items-center justify-between text-xs text-[#9ab]">
            <span>{year}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Skeleton loading
function MovieCardSkeleton() {
  return (
    <div className="bg-[#1c2228] rounded-md overflow-hidden animate-pulse flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px]">
      <div className="aspect-[2/3] bg-[#2c3440]" />
      <div className="p-2">
        <div className="h-3 bg-[#2c3440] rounded mb-2" />
        <div className="h-2 bg-[#2c3440] rounded w-1/2" />
      </div>
    </div>
  )
}

// Horizontal Movie Section Component
function MovieSection({ title, searchTerm, apiKey, isDark, page = 1 }) {
  const { data: movies, isLoading, error } = useQuery({
    queryKey: ['movies', searchTerm, page],
    queryFn: async () => {
      const res = await fetch(`https://www.omdbapi.com/?s=${searchTerm}&type=movie&page=${page}&apikey=${apiKey}`)
      const data = await res.json()
      if (data.Response === 'True' && data.Search) {
        return data.Search
      }
      return []
    },
    staleTime: 1000 * 60 * 30,
  })

  const textMain = isDark ? 'text-white' : 'text-gray-900'

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className={`text-lg font-medium mb-4 ${textMain}`}>{title}</h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
          {[...Array(8)].map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error || !movies || movies.length === 0) return null

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-medium ${textMain}`}>{title}</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} isDark={isDark} />
        ))}
      </div>
    </div>
  )
}

function Films() {
  const { isDark } = useContext(ThemeContext)
  const [searchTerm, setSearchTerm] = useState('')
  
  const apiKey = import.meta.env.VITE_OMDB_API_KEY
  
  const bgMain = isDark ? 'bg-[#14181c]' : 'bg-gray-50'
  const borderColor = isDark ? 'border-[#2c3440]' : 'border-gray-200'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-[#9ab]' : 'text-gray-600'
  const inputBg = isDark ? 'bg-[#1c2228]' : 'bg-white'

  // Plus de catégories de films via API OMDB
  const categories = [
    { title: 'Films Populaires', search: 'popular movie', page: 1 },
    { title: 'Meilleurs Films', search: 'best movie', page: 1 },
    { title: 'Films d\'Action', search: 'action', page: 1 },
    { title: 'Science-Fiction', search: 'sci-fi', page: 1 },
    { title: 'Thrillers', search: 'thriller', page: 1 },
    { title: 'Comédies', search: 'comedy', page: 1 },
    { title: 'Drames', search: 'drama', page: 1 },
    { title: 'Horreur', search: 'horror', page: 1 },
    { title: 'Aventure', search: 'adventure', page: 1 },
    { title: 'Romance', search: 'romance', page: 1 },
    { title: 'Animation', search: 'animation', page: 1 },
    { title: 'Documentaire', search: 'documentary', page: 1 },
    { title: 'Fantasy', search: 'fantasy', page: 1 },
    { title: 'Policier', search: 'crime', page: 1 },
    { title: 'Musical', search: 'musical', page: 1 },
    { title: 'Guerre', search: 'war', page: 1 },
    { title: 'Western', search: 'western', page: 1 },
    { title: 'Biopic', search: 'biography', page: 1 },
    { title: 'Sport', search: 'sport', page: 1 },
    { title: 'Mystère', search: 'mystery', page: 1 },
  ]

  // Recherche de films
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return []
      const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&type=movie&page=1&apikey=${apiKey}`)
      const data = await res.json()
      if (data.Response === 'True' && data.Search) {
        return data.Search.slice(0, 30)
      }
      return []
    },
    enabled: searchTerm.length >= 2,
  })

  return (
    <div className={`min-h-screen ${bgMain} ${textMain} transition-colors duration-300`}>
      {/* Header */}
      <header className={`${bgMain} ${borderColor} border-b sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Films
              </h1>
              <p className={`text-sm ${textSecondary}`}>
                Découvrez les meilleurs films
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${textSecondary}`} />
                <input
                  type="text"
                  placeholder="Rechercher un film..."
                  className={`w-full sm:w-64 pl-10 pr-4 py-2 ${inputBg} ${borderColor} rounded-md ${textMain} placeholder:${textSecondary} focus:outline-none focus:ring-1 focus:ring-[#00e054] focus:border-[#00e054] transition-colors`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {searchTerm && searchTerm.length >= 2 ? (
          // Search Results
          <div>
            <h2 className={`text-xl font-medium mb-6`}>
              Résultats pour "{searchTerm}"
            </h2>
            {isSearching ? (
              <div className="flex flex-wrap gap-4">
                {[...Array(12)].map((_, i) => (
                  <MovieCardSkeleton key={i} />
                ))}
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                {searchResults.map((movie) => (
                  <MovieCard key={movie.imdbID} movie={movie} isDark={isDark} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className={`${textSecondary} text-lg`}>Aucun film trouvé</p>
              </div>
            )}
          </div>
        ) : (
          // Catégories - fetch from API
          categories.map((category, index) => (
            <MovieSection 
              key={index} 
              title={category.title} 
              searchTerm={category.search}
              apiKey={apiKey}
              isDark={isDark}
              page={category.page}
            />
          ))
        )}
      </main>
    </div>
  )
}
