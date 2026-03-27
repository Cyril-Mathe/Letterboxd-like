import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useContext, useState } from 'react'
import { AuthContext, ThemeContext } from '../lib/fonctions/contexts'
import toast, { Toaster } from 'react-hot-toast';

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)
  const { isDark } = useContext(ThemeContext) || { isDark: true }
  const [formData, setFormData] = useState({ identifier: '', password: '' })

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

  const handleResetpassword = async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById("identifier");
        const email = emailInput?.value;

        if (!email) {
            toast.error("Veuillez d'abord entrer votre adresse e-mail.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/api/v1/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Un mail de réinitialisation vous a été envoyé !");
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error("Erreur :", err);
            toast.error("Erreur de connexion au serveur");
        }
    };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (await login(formData.identifier, formData.password)) {
      toast.success('Connexion réussie')
      await new Promise(resolve => setTimeout(resolve, 1500)) // wait for toast to show
      navigate({ to: '/' })
    } else {
      toast.error('Identifiant ou mot de passe incorrect')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${bgMain} ${textMain} transition-colors duration-300`}>
      <Toaster
                position="top-center"
                containerStyle={{
                    top: '75%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: '500',
                        padding: '16px 24px',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                        position: 'relative',
                    },
                    success: {
                        duration: 3000,
                        style: {
                            background: '#10b981',
                            color: '#fff',
                        },
                        iconTheme: {
                            primary: '#fff',
                            secondary: '#10b981',
                        },
                    },
                    error: {
                        duration: 5000,
                        style: {
                            background: '#ef4444',
                            color: '#fff',
                        },
                        iconTheme: {
                            primary: '#fff',
                            secondary: '#ef4444',
                        },
                    },
                    loading: {
                        duration: 2000,
                        style: {
                            background: '#3b82f6',
                            color: '#fff',
                        },
                        iconTheme: {
                            primary: '#fff',
                            secondary: '#3b82f6',
                        },
                    }
                }}
            />
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
              <label htmlFor="identifier" className="sr-only">
                Nom d'utilisateur ou email
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                required
                className={`relative block w-full px-3 py-2 border ${borderColor} ${inputBg} ${textMain} ${placeholderColor} rounded-t-md focus:outline-none focus:ring-[#00e054] focus:border-[#00e054] focus:z-10 sm:text-sm`}
                placeholder="Nom d'utilisateur ou email"
                value={formData.identifier}
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
            <div>
              <button
                type="button"
                onClick={handleResetpassword}
                className={`text-sm ${accentColor} hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00e054]`}
              >
                Mot de passe oublié ?
              </button>
            </div>
          </div>

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
