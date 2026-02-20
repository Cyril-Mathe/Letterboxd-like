import { Link } from '@tanstack/react-router'
import { Star, ChevronRight } from 'lucide-react'
import { useContext } from 'react'
import { ThemeContext } from '../contexts'

export function MovieCard({ movie, showDetailsButton = true }) {
  const { isDark } = useContext(ThemeContext)

  // Handle different movie data formats (OMDb returns Title, custom data uses title)
  const title = movie.Title || movie.title
  const poster = movie.Poster || movie.poster
  const rating = movie.imdbRating || movie.rating
  const year = movie.Year || movie.year
  const id = movie.imdbID || movie.id

  // Don't render if no poster or poster is N/A
  if (!poster || poster === 'N/A') return null

  return (
    <div 
      className={`group relative rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <Link to="/movies/$movieId" params={{ movieId: id }}>
        <div className="relative aspect-[2/3] overflow-hidden">
          <img 
            src={poster} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Rating badge */}
          {rating && rating !== 'N/A' && (
            <div className="absolute top-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-sm font-medium flex items-center">
              <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
              {rating}
            </div>
          )}
          
          {/* Title on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="font-bold text-white text-sm line-clamp-2">{title}</h3>
            {year && <p className="text-white/80 text-xs">{year}</p>}
          </div>
        </div>
        
        <div className="p-3">
          <h3 className="font-bold text-sm mb-1 line-clamp-2">{title}</h3>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{year}</span>
            {rating && rating !== 'N/A' && (
              <div className="flex items-center">
                <Star className="w-3 h-3 fill-current text-yellow-400 mr-1" />
                <span>{rating}</span>
              </div>
            )}
          </div>
          
          {showDetailsButton && (
            <button className="mt-3 w-full flex items-center justify-center px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors">
              Voir détails
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
      </Link>
    </div>
  )
}

export function MovieCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden shadow-md bg-gray-200 animate-pulse">
      <div className="aspect-[2/3] bg-gray-300" />
      <div className="p-3">
        <div className="h-4 bg-gray-300 rounded mb-2" />
        <div className="h-3 bg-gray-300 rounded w-1/2" />
      </div>
    </div>
  )
}
