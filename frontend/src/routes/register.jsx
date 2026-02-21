 import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useContext, useState } from 'react'
import { AuthContext } from '../contexts'
import { Link } from '@tanstack/react-router'
import { Film, User, Mail, Lock, UserPlus } from 'lucide-react'

export const Route = createFileRoute('/register')({
  component: Register,
})

function Register() {
  const navigate = useNavigate()
  const { register } = useContext(AuthContext)
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (register(formData.username, formData.email, formData.password)) {
      navigate({ to: '/films' })
    } else {
      setError('Email already in use')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-[#14181c] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center">
            <Film className="h-10 w-10 text-[#00e054]" />
            <span className="ml-2 text-2xl font-semibold tracking-tight text-white">CineLog</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="bg-[#1c2228] rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-white mb-2">Create account</h2>
          <p className="text-[#9ab] mb-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#00e054] hover:underline">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm text-[#9ab] mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9ab]" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#14181c] border border-[#2c3440] rounded-md text-white placeholder-[#9ab] focus:outline-none focus:ring-1 focus:ring-[#00e054] focus:border-[#00e054] transition-colors"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm text-[#9ab] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9ab]" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#14181c] border border-[#2c3440] rounded-md text-white placeholder-[#9ab] focus:outline-none focus:ring-1 focus:ring-[#00e054] focus:border-[#00e054] transition-colors"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm text-[#9ab] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9ab]" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#14181c] border border-[#2c3440] rounded-md text-white placeholder-[#9ab] focus:outline-none focus:ring-1 focus:ring-[#00e054] focus:border-[#00e054] transition-colors"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm text-[#9ab] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9ab]" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#14181c] border border-[#2c3440] rounded-md text-white placeholder-[#9ab] focus:outline-none focus:ring-1 focus:ring-[#00e054] focus:border-[#00e054] transition-colors"
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
              className="w-full flex items-center justify-center py-3 bg-[#00e054] text-[#14181c] rounded-md hover:bg-[#00c44a] transition-colors font-medium"
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
