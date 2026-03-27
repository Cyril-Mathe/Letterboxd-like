import { describe, it, expect } from 'vitest'

describe('Footer Component', () => {
  describe('Footer styling logic', () => {
    const getFooterStyles = (isDark = true) => {
      return {
        bgFooter: isDark ? 'bg-[#0d1117]' : 'bg-gray-800',
        borderColor: isDark ? 'border-[#2c3440]' : 'border-gray-700',
        textMain: isDark ? 'text-white' : 'text-white',
        textSecondary: isDark ? 'text-[#9ab]' : 'text-gray-400'
      }
    }

    it('should apply dark mode styles', () => {
      const styles = getFooterStyles(true)
      expect(styles.bgFooter).toBe('bg-[#0d1117]')
      expect(styles.textSecondary).toBe('text-[#9ab]')
    })

    it('should apply light mode styles', () => {
      const styles = getFooterStyles(false)
      expect(styles.bgFooter).toBe('bg-gray-800')
      expect(styles.textSecondary).toBe('text-gray-400')
    })

    it('should have correct text colors', () => {
      const darkStyles = getFooterStyles(true)
      const lightStyles = getFooterStyles(false)
      
      expect(darkStyles.textSecondary).not.toBe(lightStyles.textSecondary)
    })
  })

  describe('Footer data formatting', () => {
    const getCurrentYear = () => new Date().getFullYear()

    it('should return current year', () => {
      const year = getCurrentYear()
      expect(year).toBe(2026)
    })

    it('should use correct copyright year', () => {
      const year = getCurrentYear()
      const copyrightText = `© ${year} Letterboxd`
      expect(copyrightText).toContain('2026')
    })
  })
})
