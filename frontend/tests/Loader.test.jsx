import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Loader, PageLoader } from '../src/components/Loader'
import { ThemeContext } from '../src/lib/fonctions/contexts'

describe('Loader Component', () => {
  const renderWithTheme = (component, isDark = true) => {
    return render(
      <ThemeContext.Provider value={{ isDark, toggleTheme: vi.fn() }}>
        {component}
      </ThemeContext.Provider>
    )
  }

  it('should render Loader component with dark mode', () => {
    renderWithTheme(<Loader />)
    const loader = screen.getByText('Chargement...')
    expect(loader).toBeTruthy()
  })

  it('should render Loader with light mode', () => {
    renderWithTheme(<Loader />, false)
    const loader = screen.getByText('Chargement...')
    expect(loader).toBeTruthy()
  })

  it('should render Loader with custom message', () => {
    renderWithTheme(<Loader message="Chargement personnalisé" />)
    const message = screen.getByText('Chargement personnalisé')
    expect(message).toBeTruthy()
  })

  it('should render Loader with dark mode classes', () => {
    renderWithTheme(<Loader />)
    const container = document.querySelector('[class*="animate"]')
    expect(container).toBeTruthy()
  })

  it('should render PageLoader with dark mode', () => {
    renderWithTheme(<PageLoader />)
    const loader = document.querySelector('[class*="animate"]')
    expect(loader).toBeTruthy()
  })
})
