import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useContext, useState } from 'react'
import { AuthContext, ThemeContext } from '../contexts'
import { Link } from '@tanstack/react-router'
import { Film, User, Mail, Lock, UserPlus } from 'lucide-react'

export const Route = createFileRoute('/register')({
  component: Register,
})

function Register() {
  const navigate = useNavigate()
  const { register } = useContext(AuthContext)
  const { isDark } = useContext(ThemeContext) || { isDark: true }
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')

  // Theme colors
  const bgMain = isDark ? 'bg-[#14181c]' : 'bg-gray-50'
  const bgCard = isDark ? 'bg-[#1c2228]' : 'bg-white'
  const borderColor = isDark ? 'border-[#2c3440]' : 'border-gray-200'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-[#9ab]' : 'text-gray-600'
  const accentColor = isDark ? 'text-[#00e054]' : 'text-green-600'
  const accentBg = isDark ? 'bg-[#00e054]' : 'bg-green-600'
  const inputBg = isDark ? 'bg-[#14181c]' : 'bg-gray-50'
  const placeholderColor = isDark ? 'placeholder-[#9ab]' : 'placeholder-gray-400'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (await register(formData.username, formData.email, formData.password)) {
      navigate({ to: '/login' })
    } else {
      setError('Registration failed')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className={`min-h-screen ${bgMain} flex items-center justify-center px-4 transition-colors duration-300`}>
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center">
            <Film className={`h-10 w-10 ${accentColor}`} />
            <span className={`ml-2 text-2xl font-semibold tracking-tight ${textMain}`}>CineLog</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className={`${bgCard} rounded-lg p-8`}>
          <h2 className={`text-2xl font-semibold ${textMain} mb-2`}>Create account</h2>
          <p className={`${textSecondary} mb-6`}>
            Already have an account?{' '}
            <Link to="/login" className={`${accentColor} hover:underline`}>
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className={`block text-sm ${textSecondary} mb-2`}>
                Username
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${textSecondary}`} />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className={`w-full pl-10 pr-4 py-3 ${inputBg} ${borderColor} border rounded-md ${textMain} ${placeholderColor} focus:outline-none focus:ring-1 focus:ring-[#00e054] focus:border-[#00e054] transition-colors`}
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={`block text-sm ${textSecondary} mb-2`}>
                Email
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${textSecondary}`} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`w-full pl-10 pr-4 py-3 ${inputBg} ${borderColor} border rounded-md ${textMain} ${placeholderColor} focus:outline-none focus:ring-1 focus:ring-[#00e054] focus:border-[#00e054] transition-colors`}
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className={`block text-sm ${textSecondary} mb-2`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${textSecondary}`} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className={`w-full pl-10 pr-4 py-3 ${inputBg} ${borderColor} border rounded-md ${textMain} ${placeholderColor} focus:outline-none focus:ring-1 focus:ring-[#00e054] focus:border-[#00e054] transition-colors`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className={`block text-sm ${textSecondary} mb-2`}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${textSecondary}`} />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className={`w-full pl-10 pr-4 py-3 ${inputBg} ${borderColor} border rounded-md ${textMain} ${placeholderColor} focus:outline-none focus:ring-1 focus:ring-[#00e054] focus:border-[#00e054] transition-colors`}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className={`w-full flex items-center justify-center py-3 ${accentBg} text-black rounded-md hover:opacity-90 transition-colors font-medium`}
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Create account
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
