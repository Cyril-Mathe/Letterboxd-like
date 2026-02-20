import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from "@tanstack/react-router"
import { useContext } from 'react'
import { ThemeContext } from './contexts'
import { MovieCard, MovieCardSkeleton } from './components/MovieCard'
import { Loader, ErrorMessage, EmptyState } from './components/Loader'
import { RefreshCw, Film } from 'lucide-react'

export default function MoviesPage() {
  return <MoviesList />
}

export function MoviesList() {
  const navigate = useNavigate()
  const { isDark } = useContext(ThemeContext)
  const apiKey = import.meta.env.VITE_OMDB_API_KEY
  const queryClient = useQueryClient()

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['movies'],    
    queryFn: async () => {
      const [res1, res2, res3, res4] = await Promise.all([
        fetch(`https://www.omdbapi.com/?t=mulholland%20drive&apikey=${apiKey}`),
        fetch(`https://www.omdbapi.com/?t=come%20and%20see&apikey=${apiKey}`),
        fetch(`https://www.omdbapi.com/?s=batman&page=1&apikey=${apiKey}`),
        fetch(`https://www.omdbapi.com/?s=mad%20max&page=1&apikey=${apiKey}`)
      ])
      
      const [data1, data2, data3, data4] = await Promise.all([
        res1.json(),
        res2.json(),
        res3.json(),
        res4.json()
      ])

      const movies = []
      if (data1.Response === 'True') movies.push(data1)
      if (data2.Response === 'True') movies.push(data2)
      if (data3.Response === 'True') movies.push(...(data3.Search || []))
      if (data4.Response === 'True') movies.push(...(data4.Search || []))
      
      // Dédupliquer par imdbID
      const uniqueMovies = movies.filter((movie, index, self) => 
        index === self.findIndex((m) => m.imdbID === movie.imdbID)
      )
      
      return uniqueMovies
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  })

  if (isPending) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Liste des films
            </h1>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Découvrez notre sélection de films
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
          <Loader message="Chargement des films..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorMessage 
            message="Impossible de charger les films. Veuillez vérifier votre connexion et réessayer."
            onRetry={() => queryClient.invalidateQueries({ queryKey: ['movies'] })}
          />
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState 
            title="Aucun film trouvé"
            message="Nous n'avons pas pu trouver de films pour le moment. Veuillez réessayer plus tard."
            icon={Film}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 backdrop-blur-md ${isDark ? 'bg-gray-900/90 border-gray-700' : 'bg-gray-50/90 border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Liste des films
              </h1>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {data.length} films disponibles
              </p>
            </div>
            
            <button 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['movies'] })}
              disabled={isFetching}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } shadow-md disabled:opacity-50`}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {isFetching && (
        <div className="fixed top-20 right-4 z-50">
          <div className={`px-4 py-2 rounded-lg shadow-lg ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'} flex items-center`}>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin text-green-500" />
            Mise à jour...
          </div>
        </div>
      )}

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {data.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  )
}
