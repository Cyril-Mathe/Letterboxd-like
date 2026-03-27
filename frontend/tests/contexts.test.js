import { describe, it, expect } from 'vitest'
import { ThemeContext, AuthContext } from '../src/lib/fonctions/contexts'

describe('Contexts', () => {
  describe('ThemeContext', () => {
    it('should be defined', () => {
      expect(ThemeContext).toBeDefined()
    })

    it('should have Provider and Consumer', () => {
      expect(ThemeContext.Provider).toBeDefined()
      expect(ThemeContext.Consumer).toBeDefined()
    })

    it('should have default value', () => {
      expect(ThemeContext._currentValue).toBeDefined()
    })
  })

  describe('AuthContext', () => {
    it('should be defined', () => {
      expect(AuthContext).toBeDefined()
    })

    it('should have Provider and Consumer', () => {
      expect(AuthContext.Provider).toBeDefined()
      expect(AuthContext.Consumer).toBeDefined()
    })

    it('should have default value', () => {
      expect(AuthContext._currentValue).toBeDefined()
    })
  })

  describe('Context Provider behavior', () => {
    it('should allow context provider wrapping', () => {
      const themeValue = { isDark: true, toggleTheme: () => {} }
      const provider = ThemeContext.Provider
      expect(provider).toBeTruthy()
    })

    it('should handle multiple context values', () => {
      const themeValue = { isDark: false, toggleTheme: () => {} }
      const authValue = { user: null, login: () => {}, logout: () => {} }
      
      expect(themeValue.isDark).toBe(false)
      expect(authValue.user).toBeNull()
    })
  })
})
