import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Search, Star, Film, X, LayoutGrid, List } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from "@tanstack/react-router"

export const Route = createFileRoute('/films')({
  component: Films,
})

// Catégories disponibles
const CATEGORIES = [
  { id: 'all', name: 'Tous', icon: LayoutGrid },
  { id: 'action', name: 'Action', icon: Film },
  { id: 'drame', name: 'Drame', icon: Film },
  { id: 'science-fiction', name: 'Science-Fiction', icon: Film },
  { id: 'comedy', name: 'Comédie', icon: Film },
  { id: 'thriller', name: 'Thriller', icon: Film },
  { id: 'horror', name: 'Horreur', icon: Film },
  { id: 'romance', name: 'Romance', icon: Film },
  { id: 'animation', name: 'Animation', icon: Film },
  { id: 'adventure', name: 'Aventure', icon: Film },
  { id: 'crime', name: 'Crime', icon: Film },
  { id: 'documentary', name: 'Documentaire', icon: Film },
]

function Films() {
  const navigate = useNavigate()
  const apiKey = import.meta.env.VITE_OMDB_API_KEY
  const queryClient = useQueryClient()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['movies'],
    queryFn: async () => {
      const titles = [
        "mulholland", "batman", "oppenheimer", "dune", "interstellar",
        "inception", "gladiator", "avatar", "matrix", "parasite",
        "joker", "fight club", "whiplash", "godfather", "dark knight",
        "titanic", "forrest gump", "pulp fiction", "star wars", "iron man",
        "captain america", "thor", "spider-man", "black panther", "wonder woman",
        "aquaman", "harry potter", "lord of the rings", "jurassic park", "lion king",
        "mad max", "the avengers", "frozen", "toy story", "finding nemo",
        "the matrix", "kill bill", "inglourious", "django", "hannibal"
      ]

      const responses = await Promise.all(
        titles.map(title =>
          fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`)
        )
      )

      const moviesData = await Promise.all(responses.map(res => res.json()))
      const movies = moviesData.filter(movie => movie.Response === "True")

      // Deduplicate by imdbID
      const uniqueMovies = movies.filter((movie, index, self) =>
        index === self.findIndex(m => m.imdbID === movie.imdbID)
      )

      return uniqueMovies
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })

  // Extraire toutes les catégories uniques des films
  const allGenres = useMemo(() => {
    if (!data) return []
    const genres = new Set()
    data.forEach(movie => {
      if (movie.Genre) {
        movie.Genre.split(', ').forEach(genre => {
          genres.add(genre.trim().toLowerCase())
        })
      }
    })
    return Array.from(genres)
  }, [data])

  // Filtrer les films par catégorie et recherche
  const filteredMovies = useMemo(() => {
    if (!data) return []
    
    return data.filter(movie => {
      // Filter par recherche
      const matchesSearch = movie.Title.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Filter par catégorie
      let matchesCategory = true
      if (selectedCategory !== 'all' && movie.Genre) {
        const movieGenres = movie.Genre.toLowerCase().split(', ').map(g => g.trim())
        matchesCategory = movieGenres.includes(selectedCategory)
      }
      
      return matchesSearch && matchesCategory
    })
  }, [data, searchTerm, selectedCategory])

  // Obtenir les catégories d'un film
  const getMovieGenres = (genreString) => {
    if (!genreString) return []
    return genreString.split(', ').slice(0, 2)
  }

  // Obtenir la couleur du badge de catégorie
  const getCategoryColor = (genre) => {
    const colors = {
      'action': 'bg-red-600/20 text-red-400 border-red-600/30',
      'drame': 'bg-blue-600/20 text-blue-400 border-blue-600/30',
      'science-fiction': 'bg-purple-600/20 text-purple-400 border-purple-600/30',
      'comedy': 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
      'thriller': 'bg-orange-600/20 text-orange-400 border-orange-600/30',
      'horror': 'bg-red-800/20 text-red-300 border-red-800/30',
      'romance': 'bg-pink-600/20 text-pink-400 border-pink-600/30',
      'animation': 'bg-green-600/20 text-green-400 border-green-600/30',
      'adventure': 'bg-amber-600/20 text-amber-400 border-amber-600/30',
      'crime': 'bg-slate-600/20 text-slate-400 border-slate-600/30',
      'documentary': 'bg-cyan-600/20 text-cyan-400 border-cyan-600/30',
    }
    return colors[genre.toLowerCase()] || 'bg-gray-600/20 text-gray-400 border-gray-600/30'
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#14181c] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00e054]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#14181c] flex items-center justify-center">
        <p className="text-red-500">Erreur: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#14181c] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#14181c] border-b border-[#2c3440]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-[#1c2228] rounded-md transition-colors"
              >
                <Film className="h-5 w-5 text-[#00e054]" />
              </button>
              <h1 className="text-2xl font-bold">
                Films
              </h1>
              <span className="text-[#9ab] text-sm">
                ({filteredMovies.length} films)
              </span>
            </div>

            {/* Search Form */}
            <div className="flex items-center gap-3">
              <form onSubmit={(e) => e.preventDefault()} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9ab]" />
                  <input
                    type="text"
                    placeholder="Rechercher un film..."
                    className="w-full md:w-80 pl-10 pr-4 py-2 bg-[#1c2228] border border-[#2c3440] rounded-md text-white placeholder-[#9ab] focus:outline-none focus:ring-1 focus:ring-[#00e054] focus:border-[#00e054]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9ab] hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </form>

              {/* View Toggle */}
              <div className="hidden md:flex items-center bg-[#1c2228] rounded-md p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#00e054] text-black' : 'text-[#9ab] hover:text-white'}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#00e054] text-black' : 'text-[#9ab] hover:text-white'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Refresh */}
              <button
                onClick={() => queryClient.invalidateQueries({ queryKey: ['movies'] })}
                disabled={isFetching}
                className="px-4 py-2 bg-[#1c2228] hover:bg-[#2c3440] rounded-md transition-colors disabled:opacity-50 text-sm"
              >
                {isFetching ? '...' : '↻'}
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Catégories */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} fixed left-0 top-[73px] bottom-0 bg-[#14181c] border-r border-[#2c3440] overflow-y-auto transition-all duration-300 z-30`}>
          <div className="p-4">
            <h2 className="text-sm font-semibold text-[#9ab] uppercase tracking-wider mb-3">
              Catégories
            </h2>
            <nav className="space-y-1">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-[#00e054]/10 text-[#00e054] border-l-2 border-[#00e054]'
                      : 'text-[#9ab] hover:bg-[#1c2228] hover:text-white'
                  }`}
                >
                  <category.icon className="h-4 w-4" />
                  {category.name}
                </button>
              ))}
            </nav>

            {/* Catégories dynamiques */}
            {allGenres.length > 0 && (
              <>
                <h2 className="text-sm font-semibold text-[#9ab] uppercase tracking-wider mb-3 mt-6">
                  Genres OMDB
                </h2>
                <nav className="space-y-1">
                  {allGenres.slice(0, 10).map((genre) => (
                    <button
                      key={genre}
                      onClick={() => setSelectedCategory(genre)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors capitalize ${
                        selectedCategory === genre
                          ? 'bg-[#00e054]/10 text-[#00e054] border-l-2 border-[#00e054]'
                          : 'text-[#9ab] hover:bg-[#1c2228] hover:text-white'
                      }`}
                    >
                      <Film className="h-4 w-4" />
                      {genre}
                    </button>
                  ))}
                </nav>
              </>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Catégorie actuelle */}
            {selectedCategory !== 'all' && (
              <div className="mb-6 flex items-center gap-2">
                <span className="text-[#9ab]">Filtré par:</span>
                <span className="px-3 py-1 bg-[#00e054]/20 text-[#00e054] rounded-full text-sm capitalize border border-[#00e054]/30">
                  {selectedCategory}
                </span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-[#9ab] hover:text-white text-sm"
                >
                  (Effacer)
                </button>
              </div>
            )}

            {/* Films Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {filteredMovies.map((movie) => (
                  <div
                    key={movie.imdbID}
                    onClick={() => navigate({ to: `/movies/${movie.imdbID}` })}
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

                      {/* Rating */}
                      {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                        <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                          {movie.imdbRating}
                          <Star className="h-3 w-3 ml-1 fill-current text-[#00e054]" />
                        </div>
                      )}

                      {/* Catégories au hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex flex-wrap gap-1">
                          {getMovieGenres(movie.Genre).map((genre, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 text-[10px] rounded border ${getCategoryColor(genre)}`}
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-3">
                      <h3 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-[#00e054] transition-colors">
                        {movie.Title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-[#9ab]">
                        <span>{movie.Year}</span>
                        {movie.Genre && (
                          <span className="line-clamp-1">{movie.Genre.split(', ')[0]}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // View Liste
              <div className="space-y-3">
                {filteredMovies.map((movie) => (
                  <div
                    key={movie.imdbID}
                    onClick={() => navigate({ to: `/movies/${movie.imdbID}` })}
                    className="flex gap-4 bg-[#1c2228] rounded-md overflow-hidden cursor-pointer hover:shadow-lg hover:ring-1 hover:ring-[#00e054] transition-all duration-200 p-3"
                  >
                    <div className="w-16 md:w-20 flex-shrink-0">
                      {movie.Poster && movie.Poster !== 'N/A' && (
                        <img
                          src={movie.Poster}
                          alt={movie.Title}
                          className="w-full h-24 md:h-28 object-cover rounded"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm md:text-base mb-1 hover:text-[#00e054] transition-colors">
                        {movie.Title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-[#9ab] mb-2">
                        <span>{movie.Year}</span>
                        {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                          <>
                            <span>•</span>
                            <span className="flex items-center">
                              <Star className="h-3 w-3 mr-1 fill-current text-[#00e054]" />
                              {movie.imdbRating}
                            </span>
                          </>
                        )}
                        {movie.Runtime && movie.Runtime !== 'N/A' && (
                          <>
                            <span>•</span>
                            <span>{movie.Runtime}</span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {getMovieGenres(movie.Genre).map((genre, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 text-[10px] rounded border ${getCategoryColor(genre)}`}
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredMovies.length === 0 && (
              <div className="text-center py-16">
                <Film className="h-16 w-16 text-[#9ab] mx-auto mb-4" />
                <p className="text-[#9ab] text-lg mb-2">
                  Aucun film trouvé
                </p>
                <p className="text-[#9ab] text-sm">
                  Essayez avec d'autres mots-clés ou catégories
                </p>
                {(searchTerm || selectedCategory !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('all')
                    }}
                    className="mt-4 px-4 py-2 bg-[#00e054] text-black rounded-md hover:bg-[#00cc45] transition-colors"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
