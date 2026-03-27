import { describe, it, expect } from 'vitest'
import { MovieCard } from '../src/components/MovieCard'

describe('MovieCard Component', () => {
  const mockMovie = {
    imdbID: 'tt0111161',
    Title: 'The Shawshank Redemption',
    Poster: 'https://example.com/poster.jpg',
    imdbRating: '9.3',
    Year: '1994'
  }

  it('should return null if poster is missing', () => {
    const movieWithoutPoster = { ...mockMovie, Poster: undefined }
    const result = MovieCard({ movie: movieWithoutPoster })
    expect(result).toBeNull()
  })

  it('should return null if poster is N/A', () => {
    const movieWithoutPoster = { ...mockMovie, Poster: 'N/A' }
    const result = MovieCard({ movie: movieWithoutPoster })
    expect(result).toBeNull()
  })

  it('should handle alternative poster property name', () => {
    const movieAlt = {
      imdbID: 'tt0111161',
      title: 'The Shawshank Redemption',
      poster: 'https://example.com/poster.jpg',
      rating: '9.3',
      year: '1994'
    }
    const result = MovieCard({ movie: movieAlt })
    expect(result).not.toBeNull()
  })

  it('should handle missing properties gracefully', () => {
    const minimalMovie = {
      imdbID: 'tt0111161',
      Poster: 'https://example.com/poster.jpg'
    }
    const result = MovieCard({ movie: minimalMovie })
    expect(result).not.toBeNull()
  })

  it('should use default values for missing properties', () => {
    const movieMissingTitle = {
      imdbID: 'tt0111161',
      Poster: 'https://example.com/poster.jpg',
      Year: undefined,
      imdbRating: undefined
    }
    const result = MovieCard({ movie: movieMissingTitle })
    expect(result).not.toBeNull()
  })
})
