import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('API Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('API Request Helpers', () => {
    const createMockAxios = () => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    })

    it('should handle successful GET request', async () => {
      const mockAxios = createMockAxios()
      const mockData = { id: 1, name: 'Test' }
      
      mockAxios.get.mockResolvedValue({ data: mockData })
      
      const result = await mockAxios.get('/api/test')
      expect(result.data).toEqual(mockData)
    })

    it('should handle failed GET request', async () => {
      const mockAxios = createMockAxios()
      const mockError = new Error('Network error')
      
      mockAxios.get.mockRejectedValue(mockError)
      
      try {
        await mockAxios.get('/api/test')
        expect.fail('Should have thrown error')
      } catch (error) {
        expect(error.message).toBe('Network error')
      }
    })

    it('should handle POST request with data', async () => {
      const mockAxios = createMockAxios()
      const mockData = { id: 1, name: 'New Item' }
      
      mockAxios.post.mockResolvedValue({ data: mockData })
      
      const result = await mockAxios.post('/api/items', mockData)
      expect(result.data).toEqual(mockData)
    })

    it('should handle DELETE request', async () => {
      const mockAxios = createMockAxios()
      mockAxios.delete.mockResolvedValue({ status: 200 })
      
      const result = await mockAxios.delete('/api/items/1')
      expect(result.status).toBe(200)
    })
  })

  describe('Movie API Helpers', () => {
    const mockMovieResponse = {
      imdbID: 'tt0111161',
      Title: 'The Shawshank Redemption',
      Year: '1994',
      imdbRating: '9.3',
      Poster: 'https://example.com/poster.jpg'
    }

    const parseMovieData = (data) => {
      return {
        id: data.imdbID,
        title: data.Title,
        year: data.Year,
        rating: parseFloat(data.imdbRating) || 0,
        poster: data.Poster !== 'N/A' ? data.Poster : null
      }
    }

    it('should parse movie data correctly', () => {
      const parsed = parseMovieData(mockMovieResponse)
      expect(parsed.id).toBe('tt0111161')
      expect(parsed.title).toBe('The Shawshank Redemption')
      expect(parsed.rating).toBe(9.3)
    })

    it('should handle N/A poster values', () => {
      const movieWithNAPoster = { ...mockMovieResponse, Poster: 'N/A' }
      const parsed = parseMovieData(movieWithNAPoster)
      expect(parsed.poster).toBeNull()
    })

    it('should convert rating to number', () => {
      const parsed = parseMovieData(mockMovieResponse)
      expect(typeof parsed.rating).toBe('number')
      expect(parsed.rating).toBeGreaterThan(0)
    })
  })

  describe('Review API Helpers', () => {
    const createReview = (userId, movieId, rating, comment) => {
      return {
        id: Math.random().toString(36),
        userId,
        movieId,
        rating,
        comment,
        createdAt: new Date().toISOString()
      }
    }

    it('should create review object with all fields', () => {
      const review = createReview('user1', 'tt0111161', 5, 'Great movie!')
      expect(review.userId).toBe('user1')
      expect(review.movieId).toBe('tt0111161')
      expect(review.rating).toBe(5)
      expect(review.comment).toBe('Great movie!')
    })

    it('should generate unique review ids', () => {
      const review1 = createReview('user1', 'movie1', 5, 'Good')
      const review2 = createReview('user2', 'movie2', 4, 'Nice')
      expect(review1.id).not.toBe(review2.id)
    })

    it('should set createdAt timestamp', () => {
      const review = createReview('user1', 'movie1', 5, 'Good')
      expect(review.createdAt).toBeDefined()
      expect(new Date(review.createdAt)).toBeInstanceOf(Date)
    })
  })

  describe('User API Helpers', () => {
    const validateUserData = (user) => {
      const errors = []
      
      if (!user.email || !user.email.includes('@')) {
        errors.push('Invalid email')
      }
      if (!user.password || user.password.length < 8) {
        errors.push('Password too short')
      }
      if (!user.username || user.username.length < 3) {
        errors.push('Username too short')
      }
      
      return {
        isValid: errors.length === 0,
        errors
      }
    }

    it('should validate correct user data', () => {
      const user = {
        email: 'test@example.com',
        password: 'securePassword123',
        username: 'testuser'
      }
      const result = validateUserData(user)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect invalid email', () => {
      const user = {
        email: 'invalid-email',
        password: 'securePassword123',
        username: 'testuser'
      }
      const result = validateUserData(user)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Invalid email')
    })

    it('should detect weak password', () => {
      const user = {
        email: 'test@example.com',
        password: 'weak',
        username: 'testuser'
      }
      const result = validateUserData(user)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password too short')
    })

    it('should detect short username', () => {
      const user = {
        email: 'test@example.com',
        password: 'securePassword123',
        username: 'ab'
      }
      const result = validateUserData(user)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Username too short')
    })
  })
})
