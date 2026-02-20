import { createFileRoute } from '@tanstack/react-router'
import { useContext, useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { ThemeContext } from '../contexts'
import { Search, Star, Film, Filter } from 'lucide-react'

export const Route = createFileRoute('/films')({
  component: Films,
})

function Films() {
  const { isDark } = useContext(ThemeContext)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('Tous')

  // Données simulées de films
  const movies = [
    {
      id: 1,
      title: "Dune: Part Two",
      poster: "https://placehold.co/300x450/1a1a1a/ffffff?text=Dune+2",
      rating: 4.2,
      year: 2024,
      genre: "Science-Fiction",
      duration: "166 min",
      synopsis: "Paul Atreides s'unit à Chani et aux Fremen pour prendre sa revanche contre ceux qui ont détruit sa famille."
    },
    {
      id: 2,
      title: "Oppenheimer",
      poster: "https://placehold.co/300x450/2a2a2a/ffffff?text=Oppenheimer",
      rating: 4.5,
      year: 2023,
      genre: "Drame",
      duration: "180 min",
      synopsis: "L'histoire du scientifique américain J. Robert Oppenheimer et son rôle dans le développement de la bombe atomique."
    },
    {
      id: 3,
      title: "The Batman",
      poster: "https://placehold.co/300x450/3a3a3a/ffffff?text=Batman",
      rating: 4.0,
      year: 2022,
      genre: "Action",
      duration: "176 min",
      synopsis: "Batman est forcé de sortir de l'ombre pour traquer le Riddler, un tueur en série qui sème le chaos à Gotham."
    },
    {
      id: 4,
      title: "Parasite",
      poster: "https://placehold.co/300x450/4a4a4a/ffffff?text=Parasite",
      rating: 4.6,
      year: 2019,
      genre: "Thriller",
      duration: "132 min",
      synopsis: "Une famille pauvre s'infiltre dans la vie d'une famille riche en se faisant passer pour des domestiques qualifiés."
    },
    {
      id: 5,
      title: "Everything Everywhere All at Once",
      poster: "https://placehold.co/300x450/5a5a5a/ffffff?text=EEAAO",
      rating: 4.4,
      year: 2022,
      genre: "Science-Fiction",
      duration: "139 min",
      synopsis: "Une femme chinoise-américaine doit connecter avec des versions parallèles d'elle-même pour prévenir une catastrophe puissante."
    },
    {
      id: 6,
      title: "The Holdovers",
      poster: "https://placehold.co/300x450/6a6a6a/ffffff?text=Holdovers",
      rating: 4.1,
      year: 2023,
      genre: "Drame",
      duration: "133 min",
      synopsis: "Un professeur grincheux est chargé de surveiller un groupe d'étudiants pendant les vacances de Noël."
    },
    {
      id: 7,
      title: "Poor Things",
      poster: "https://placehold.co/300x450/7a7a7a/ffffff?text=Poor+Things",
      rating: 4.3,
      year: 2023,
      genre: "Comédie",
      duration: "141 min",
      synopsis: "L'histoire extraordinaire de Bella Baxter, une jeune femme au passé mystérieux qui vit une aventure extraordinaire."
    },
    {
      id: 8,
      title: "Killers of the Flower Moon",
      poster: "https://placehold.co/300x450/8a8a8a/ffffff?text=KOTFM",
      rating: 4.2,
      year: 2023,
      genre: "Drame",
      duration: "206 min",
      synopsis: "L'histoire vraie d'une série de meurtres racistes dans les années 1920 contre les Osages dans l'Oklahoma."
    },
    {
      id: 9,
      title: "Anatomy of a Fall",
      poster: "https://placehold.co/300x450/9a9a9a/ffffff?text=Anatomy",
      rating: 4.0,
      year: 2023,
      genre: "Thriller",
      duration: "151 min",
      synopsis: "Une femme est accusée du meurtre de son mari, un écrivain célèbre, et doit se défendre seule au tribunal."
    },
    {
      id: 10,
      title: "The Zone of Interest",
      poster: "https://placehold.co/300x450/101010/ffffff?text=Zone+of+Interest",
      rating: 3.8,
      year: 2023,
      genre: "Drame",
      duration: "105 min",
      synopsis: "L'histoire de Rudolf Höss, commandant d'Auschwitz, et de sa famille vivant à côté du camp de concentration."
    }
  ]

  const genres = ['Tous', 'Action', 'Drame', 'Science-Fiction', 'Thriller', 'Comédie']

  // Filtrage des films
  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesGenre = selectedGenre === 'Tous' || movie.genre === selectedGenre
      return matchesSearch && matchesGenre
    })
  }, [searchTerm, selectedGenre])

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header avec recherche et filtres */}
      <div className={`sticky top-0 z-50 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold flex items-center">
              <Film className="h-6 w-6 mr-2 text-green-500" />
              Films
            </h1>

            {/* Barre de recherche */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un film..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filtres par genre */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className={`px-3 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grille de films */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredMovies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              className={`rounded-lg overflow-hidden shadow-md ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
            >
              <div className="relative">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm font-medium">
                  {movie.rating}
                  <Star className="inline h-3 w-3 ml-1 fill-current text-yellow-400" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm mb-1 line-clamp-2">{movie.title}</h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{movie.year}</span>
                  <span>{movie.genre}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <div className="text-center py-12">
            <Film className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Aucun film trouvé
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
