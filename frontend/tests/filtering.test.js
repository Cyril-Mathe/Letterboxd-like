import { describe, it, expect } from 'vitest'

describe('Data Filtering and Searching', () => {
  describe('Simple filter function', () => {
    const filterByTitle = (items, searchValue) => {
      if (!searchValue || searchValue.trim() === '') {
        return items
      }
      return items.filter(item => 
        item.title.toLowerCase().includes(searchValue.toLowerCase())
      )
    }

    it('should filter items based on search value', () => {
      const items = [
        { id: 1, title: 'Inception' },
        { id: 2, title: 'The Matrix' },
        { id: 3, title: 'Tenet' }
      ]

      const result = filterByTitle(items, 'the')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle empty filter results', () => {
      const items = [{ id: 1, title: 'Inception' }]
      const result = filterByTitle(items, 'nonexistent')
      expect(result).toHaveLength(0)
    })

    it('should return all items for empty search', () => {
      const items = [
        { id: 1, title: 'Inception' },
        { id: 2, title: 'The Matrix' }
      ]
      const result = filterByTitle(items, '')
      expect(result).toHaveLength(2)
    })

    it('should be case insensitive', () => {
      const items = [
        { id: 1, title: 'Inception' },
        { id: 2, title: 'the matrix' }
      ]
      const result = filterByTitle(items, 'THE')
      expect(result).toHaveLength(1)
    })
  })

  describe('Movie rating filter', () => {
    const filterByRating = (items, minRating) => {
      return items.filter(item => 
        parseFloat(item.rating) >= minRating
      )
    }

    it('should filter movies by minimum rating', () => {
      const items = [
        { id: 1, title: 'Movie 1', rating: '9.0' },
        { id: 2, title: 'Movie 2', rating: '7.5' },
        { id: 3, title: 'Movie 3', rating: '8.5' }
      ]

      const result = filterByRating(items, 8.0)
      expect(result).toHaveLength(2)
    })

    it('should return empty array if no movies meet criteria', () => {
      const items = [
        { id: 1, title: 'Movie 1', rating: '6.0' }
      ]

      const result = filterByRating(items, 8.0)
      expect(result).toHaveLength(0)
    })
  })

  describe('Genre filter', () => {
    const filterByGenres = (items, selectedGenres) => {
      if (!selectedGenres || selectedGenres.length === 0) {
        return items
      }

      return items.filter(item =>
        item.genres.some(genre => selectedGenres.includes(genre))
      )
    }

    it('should filter by single genre', () => {
      const items = [
        { id: 1, title: 'Movie 1', genres: ['Action', 'Drama'] },
        { id: 2, title: 'Movie 2', genres: ['Comedy'] },
        { id: 3, title: 'Movie 3', genres: ['Action', 'Thriller'] }
      ]

      const result = filterByGenres(items, ['Action'])
      expect(result).toHaveLength(2)
    })

    it('should filter by multiple genres (OR logic)', () => {
      const items = [
        { id: 1, title: 'Movie 1', genres: ['Action'] },
        { id: 2, title: 'Movie 2', genres: ['Comedy'] },
        { id: 3, title: 'Movie 3', genres: ['Drama'] }
      ]

      const result = filterByGenres(items, ['Action', 'Comedy'])
      expect(result).toHaveLength(2)
    })

    it('should return all items if no genres selected', () => {
      const items = [
        { id: 1, title: 'Movie 1', genres: ['Action'] },
        { id: 2, title: 'Movie 2', genres: ['Comedy'] }
      ]

      const result = filterByGenres(items, [])
      expect(result).toHaveLength(2)
    })
  })

  describe('Advanced filtering with multiple criteria', () => {
    const advancedFilter = (items, filters) => {
      return items.filter(item => {
        const titleMatch = !filters.title || 
          item.title.toLowerCase().includes(filters.title.toLowerCase())
        const ratingMatch = !filters.minRating || 
          parseFloat(item.rating) >= filters.minRating
        const yearMatch = !filters.year || 
          item.year === filters.year

        return titleMatch && ratingMatch && yearMatch
      })
    }

    it('should apply multiple filters', () => {
      const items = [
        { id: 1, title: 'Inception', rating: '8.8', year: 2010 },
        { id: 2, title: 'The Matrix', rating: '8.7', year: 1999 },
        { id: 3, title: 'Interstellar', rating: '8.6', year: 2014 }
      ]

      const result = advancedFilter(items, {
        title: 'in',
        minRating: 8.5,
        year: 2010
      })

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Inception')
    })

    it('should work with partial filters', () => {
      const items = [
        { id: 1, title: 'Inception', rating: '8.8', year: 2010 },
        { id: 2, title: 'The Matrix', rating: '8.7', year: 1999 }
      ]

      const result = advancedFilter(items, {
        minRating: 8.5
      })

      expect(result).toHaveLength(2)
    })
  })
})
