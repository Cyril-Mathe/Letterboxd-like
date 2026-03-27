import { describe, it, expect, beforeEach } from 'vitest'

describe('Form Validation', () => {
  describe('Login Form Validation', () => {
    const validateLoginForm = (email, password) => {
      const errors = {}
      
      if (!email || !email.includes('@')) {
        errors.email = 'Invalid email'
      }
      if (!password || password.length < 6) {
        errors.password = 'Password must be at least 6 characters'
      }
      
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      }
    }

    it('should validate correct login credentials', () => {
      const result = validateLoginForm('user@example.com', 'password123')
      expect(result.isValid).toBe(true)
      expect(Object.keys(result.errors)).toHaveLength(0)
    })

    it('should reject invalid email', () => {
      const result = validateLoginForm('invalid', 'password123')
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBeDefined()
    })

    it('should reject short password', () => {
      const result = validateLoginForm('user@example.com', 'short')
      expect(result.isValid).toBe(false)
      expect(result.errors.password).toBeDefined()
    })

    it('should reject both invalid email and short password', () => {
      const result = validateLoginForm('invalid', 'short')
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBeDefined()
      expect(result.errors.password).toBeDefined()
    })
  })

  describe('Register Form Validation', () => {
    const validateRegisterForm = (email, password, confirmPassword, username) => {
      const errors = {}
      
      if (!email || !email.includes('@')) {
        errors.email = 'Invalid email'
      }
      if (!password || password.length < 8) {
        errors.password = 'Password must be at least 8 characters'
      }
      if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
      }
      if (!username || username.length < 3) {
        errors.username = 'Username must be at least 3 characters'
      }
      
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      }
    }

    it('should validate correct registration data', () => {
      const result = validateRegisterForm(
        'newuser@example.com',
        'securePassword123',
        'securePassword123',
        'newuser'
      )
      expect(result.isValid).toBe(true)
    })

    it('should detect non-matching passwords', () => {
      const result = validateRegisterForm(
        'newuser@example.com',
        'securePassword123',
        'differentPassword',
        'newuser'
      )
      expect(result.isValid).toBe(false)
      expect(result.errors.confirmPassword).toBeDefined()
    })

    it('should detect short username', () => {
      const result = validateRegisterForm(
        'newuser@example.com',
        'securePassword123',
        'securePassword123',
        'ab'
      )
      expect(result.isValid).toBe(false)
      expect(result.errors.username).toBeDefined()
    })

    it('should detect weak password', () => {
      const result = validateRegisterForm(
        'newuser@example.com',
        'weak',
        'weak',
        'newuser'
      )
      expect(result.isValid).toBe(false)
      expect(result.errors.password).toBeDefined()
    })
  })

  describe('Review Form Validation', () => {
    const validateReviewForm = (rating, comment) => {
      const errors = {}
      
      if (rating < 1 || rating > 10) {
        errors.rating = 'Rating must be between 1 and 10'
      }
      if (!comment || comment.trim().length === 0) {
        errors.comment = 'Comment cannot be empty'
      }
      if (comment && comment.length > 1000) {
        errors.comment = 'Comment too long (max 1000 characters)'
      }
      
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      }
    }

    it('should validate correct review', () => {
      const result = validateReviewForm(8, 'Great movie! Highly recommended.')
      expect(result.isValid).toBe(true)
    })

    it('should reject invalid rating', () => {
      const result = validateReviewForm(11, 'Good movie')
      expect(result.isValid).toBe(false)
      expect(result.errors.rating).toBeDefined()
    })

    it('should reject empty comment', () => {
      const result = validateReviewForm(8, '')
      expect(result.isValid).toBe(false)
      expect(result.errors.comment).toBeDefined()
    })

    it('should reject comment that is too long', () => {
      const longComment = 'a'.repeat(1001)
      const result = validateReviewForm(8, longComment)
      expect(result.isValid).toBe(false)
      expect(result.errors.comment).toBeDefined()
    })

    it('should accept comment with max length', () => {
      const maxComment = 'a'.repeat(1000)
      const result = validateReviewForm(8, maxComment)
      expect(result.isValid).toBe(true)
    })
  })

  describe('Search Form Validation', () => {
    const validateSearchForm = (query) => {
      const errors = {}
      
      if (!query || query.trim().length === 0) {
        errors.query = 'Search query cannot be empty'
      }
      if (query && query.length > 50) {
        errors.query = 'Search query too long (max 50 characters)'
      }
      
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      }
    }

    it('should validate valid search query', () => {
      const result = validateSearchForm('inception')
      expect(result.isValid).toBe(true)
    })

    it('should reject empty query', () => {
      const result = validateSearchForm('')
      expect(result.isValid).toBe(false)
      expect(result.errors.query).toBeDefined()
    })

    it('should reject query that is too long', () => {
      const longQuery = 'a'.repeat(51)
      const result = validateSearchForm(longQuery)
      expect(result.isValid).toBe(false)
      expect(result.errors.query).toBeDefined()
    })
  })
})
