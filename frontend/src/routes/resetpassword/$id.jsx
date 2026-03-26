import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

export const Route = createFileRoute('/resetpassword/$id')({
  component: Resetpassword,
})

function Resetpassword() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ mot_de_passe: '' })
  const [error, setError] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChangePost = (event) => {
    const { name, value } = event.target
    setForm((prevForm) => ({ ...prevForm, [name]: value }))
    if (error[name]) {
      setError((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handlePostSubmit = async (event) => {
    event.preventDefault()

    let formError = {}
    if (!form.mot_de_passe) {
      formError.mot_de_passe = 'Veuillez entrer un nouveau mot de passe'
    } else if (form.mot_de_passe.length < 2) {
      formError.mot_de_passe = 'Le mot de passe doit contenir au moins 2 caractères'
    }

    if (Object.keys(formError).length > 0) {
      setError(formError)
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.put(
        `http://localhost:3000/api/v1/reset-password/${id}`,
        { mot_de_passe: form.mot_de_passe }
      )

      if (response.status === 200 || response.status === 201) {
        toast.success('Votre mot de passe a été changé avec succès')
        setTimeout(() => navigate({ to: '/login' }), 1500)
      }
    } catch (err) {
      console.error('Erreur:', err)
      toast.error(err.response?.data?.error || 'Une erreur est survenue')
      setError({ submit: 'Impossible de réinitialiser le mot de passe. Le lien a peut-être expiré.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Toaster position="top-right" />
      <div className="w-full max-w-md">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Réinitialisation du mot de passe
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Entrez votre nouveau mot de passe ci-dessous
          </p>

          <form onSubmit={handlePostSubmit} className="space-y-4">
            <div>
              <label htmlFor="mot_de_passe" className="block text-sm font-medium text-gray-700 mb-1">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                id="mot_de_passe"
                name="mot_de_passe"
                placeholder="Entrez votre nouveau mot de passe"
                value={form.mot_de_passe}
                onChange={handleChangePost}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              {error.mot_de_passe && (
                <p className="text-red-500 text-sm mt-1">{error.mot_de_passe}</p>
              )}
            </div>

            {error.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error.submit}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Changement en cours...' : 'Changer le mot de passe'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
