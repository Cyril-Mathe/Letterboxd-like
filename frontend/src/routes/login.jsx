import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useContext, useState } from 'react'
import { AuthContext, ThemeContext } from '../contexts'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)
  const { isDark } = useContext(ThemeContext) || { isDark: true }
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  // Theme colors
  const bgMain = isDark ? 'bg-[#14181c]' : 'bg-gray-50'
  const bgCard = isDark ? 'bg-[#1c2228]' : 'bg-white'
  const borderColor = isDark ? 'border-[#2c3440]' : 'border-gray-200'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-[#9ab]' : 'text-gray-600'
  const accentColor = isDark ? 'text-[#00e054]' : 'text-green-600'
  const accentBg = isDark ? 'bg-[#00e054]' : 'bg-green-600'
  const inputBg = isDark ? 'bg-[#1c2228]' : 'bg-white'
  const placeholderColor = isDark ? 'placeholder-[#9ab]' : 'placeholder-gray-500'

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (login(formData.email, formData.password)) {
      navigate({ to: '/' })
    } else {
      setError('Email ou mot de passe incorrect')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${bgMain} ${textMain} transition-colors duration-300`}>
      <div className={`max-w-md w-full space-y-8 p-8 rounded-lg shadow-lg ${bgCard}`}>
        <div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${textMain}`}>
            Connexion
          </h2>
          <p className={`mt-2 text-center text-sm ${textSecondary}`}>
            Ou{' '}
            <a href="/register" className={`font-medium ${accentColor} hover:opacity-80`}>
              créez un nouveau compte
            </a>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`relative block w-full px-3 py-2 border ${borderColor} ${inputBg} ${textMain} ${placeholderColor} rounded-t-md focus:outline-none focus:ring-[#00e054] focus:border-[#00e054] focus:z-10 sm:text-sm`}
                placeholder="Adresse email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`relative block w-full px-3 py-2 border ${borderColor} ${inputBg} ${textMain} ${placeholderColor} rounded-b-md focus:outline-none focus:ring-[#00e054] focus:border-[#00e054] focus:z-10 sm:text-sm`}
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className={`${accentColor} text-sm text-center`}>
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black ${accentBg} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00e054]`}
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
