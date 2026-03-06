import { Link } from '@tanstack/react-router'
import { Play } from 'lucide-react'

export function MovieCard({ movie, showDetailsButton = false }) {
  // Handle different movie data formats
  const title = movie.Title || movie.title || 'Unknown'
  const poster = movie.Poster || movie.poster
  const rating = movie.imdbRating || movie.rating
  const year = movie.Year || movie.year
  const id = movie.imdbID || movie.id

  // Don't render if no poster or poster is N/A
  if (!poster || poster === 'N/A') return null

  return (
    <Link 
      to="/movies/$movieId" 
      params={{ movieId: id }}
      className="block group flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px]"
    >
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

export function MovieCardSkeleton() {
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
