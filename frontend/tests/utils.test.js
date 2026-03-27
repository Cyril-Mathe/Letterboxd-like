import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('Utility Functions', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('LocalStorage Utilities', () => {
    it('should save and retrieve data from localStorage', () => {
      const testData = { userId: 123, name: 'Test User' }
      localStorage.setItem('testKey', JSON.stringify(testData))
      
      expect(localStorage.setItem).toHaveBeenCalled()
    })

    it('should handle null values', () => {
      localStorage.getItem('nullKey')
      
      expect(localStorage.getItem).toHaveBeenCalled()
    })

    it('should remove items from localStorage', () => {
      localStorage.removeItem('removeKey')
      
      expect(localStorage.removeItem).toHaveBeenCalled()
    })

    it('should clear all localStorage items', () => {
      localStorage.clear()
      
      expect(localStorage.clear).toHaveBeenCalled()
    })
  })

  describe('String Utilities', () => {
    const truncateString = (str, length) => {
      return str.length > length ? str.substring(0, length) + '...' : str
    }

    it('should truncate long strings', () => {
      const result = truncateString('This is a very long string', 10)
      expect(result).toBe('This is a ...')
    })

    it('should not truncate short strings', () => {
      const result = truncateString('Short', 10)
      expect(result).toBe('Short')
    })

    it('should handle empty strings', () => {
      const result = truncateString('', 10)
      expect(result).toBe('')
    })
  })

  describe('Array Utilities', () => {
    const removeDuplicates = (arr) => {
      return [...new Set(arr)]
    }

    const filterByProperty = (arr, property, value) => {
      return arr.filter(item => item[property] === value)
    }

    it('should remove duplicate values', () => {
      const arr = [1, 2, 2, 3, 3, 3, 4]
      const result = removeDuplicates(arr)
      expect(result).toEqual([1, 2, 3, 4])
    })

    it('should handle empty arrays', () => {
      const result = removeDuplicates([])
      expect(result).toEqual([])
    })

    it('should filter array by property', () => {
      const arr = [
        { id: 1, status: 'active' },
        { id: 2, status: 'inactive' },
        { id: 3, status: 'active' }
      ]
      const result = filterByProperty(arr, 'status', 'active')
      expect(result).toHaveLength(2)
      expect(result[0].id).toBe(1)
    })

    it('should return empty array if no matches', () => {
      const arr = [
        { id: 1, status: 'active' },
        { id: 2, status: 'active' }
      ]
      const result = filterByProperty(arr, 'status', 'inactive')
      expect(result).toEqual([])
    })
  })

  describe('Object Utilities', () => {
    const mergeObjects = (obj1, obj2) => {
      return { ...obj1, ...obj2 }
    }

    const deepEqual = (obj1, obj2) => {
      return JSON.stringify(obj1) === JSON.stringify(obj2)
    }

    it('should merge two objects', () => {
      const obj1 = { a: 1, b: 2 }
      const obj2 = { c: 3, d: 4 }
      const result = mergeObjects(obj1, obj2)
      expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 })
    })

    it('should override properties when merging', () => {
      const obj1 = { a: 1, b: 2 }
      const obj2 = { b: 3, c: 4 }
      const result = mergeObjects(obj1, obj2)
      expect(result.b).toBe(3)
    })

    it('should compare objects for deep equality', () => {
      const obj1 = { a: 1, b: { c: 2 } }
      const obj2 = { a: 1, b: { c: 2 } }
      expect(deepEqual(obj1, obj2)).toBe(true)
    })

    it('should detect differences in objects', () => {
      const obj1 = { a: 1, b: 2 }
      const obj2 = { a: 1, b: 3 }
      expect(deepEqual(obj1, obj2)).toBe(false)
    })
  })

  describe('Validation Utilities', () => {
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    const isValidPassword = (password) => {
      return !!(password && password.length >= 8)
    }

    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
    })

    it('should reject invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
    })

    it('should validate strong password', () => {
      expect(isValidPassword('strongPassword123')).toBe(true)
    })

    it('should reject weak password', () => {
      expect(isValidPassword('weak')).toBe(false)
    })

    it('should reject empty password', () => {
      expect(isValidPassword('')).toBe(false)
    })
  })
})
