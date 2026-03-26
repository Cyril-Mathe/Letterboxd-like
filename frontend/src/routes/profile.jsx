import { createFileRoute, redirect } from '@tanstack/react-router'
import { useContext, useState, useEffect } from 'react'
import { ThemeContext, AuthContext } from '../contexts'
import { User, Star, Eye, MessageCircle, Calendar, Edit, Save, X, Lock } from 'lucide-react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

export const Route = createFileRoute('/profile')({
  beforeLoad: ({ context }) => {
    // Check if user is authenticated
    const user = localStorage.getItem('cineconnect_user')
    if (!user) {
      throw redirect({
        to: '/login',
        search: {},
      })
    }
  },
  component: Profile,
})

function Profile() {
  const { isDark } = useContext(ThemeContext) || { isDark: true }
  const { user, logout } = useContext(AuthContext)
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    biographie: user?.biographie || 'Passionné de cinéma et de critiques constructives. J\'aime découvrir de nouveaux films et partager mes impressions avec la communauté.'
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState({})
  const [isLoadingSave, setIsLoadingSave] = useState(false)
  const [isLoadingPassword, setIsLoadingPassword] = useState(false)
  const [stats, setStats] = useState({
    filmsVus: 0,
    avisPublies: 0,
    filmsFavoris: 0,
    moyenneNotes: 0
  })
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  // Theme colors
  const bgMain = isDark ? 'bg-[#14181c]' : 'bg-gray-50'
  const bgCard = isDark ? 'bg-[#1c2228]' : 'bg-white'
  const borderColor = isDark ? 'border-[#2c3440]' : 'border-gray-200'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-[#9ab]' : 'text-gray-600'
  const accentColor = isDark ? 'text-[#00e054]' : 'text-green-600'
  const accentBg = isDark ? 'bg-[#00e054]' : 'bg-green-600'
  const inputBg = isDark ? 'bg-[#1c2228]' : 'bg-white'
  const hoverBg = isDark ? 'bg-[#2c3440]' : 'bg-gray-100'

  // Charger les statistiques de l'utilisateur
  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoadingStats(true)
        // Récupérer les films vus avec l'userId en paramètre
        const watchedResponse = await axios.get(
          `http://localhost:3000/api/v1/watched-movies?userId=${user.id}`
        )
        const watchedMovies = Array.isArray(watchedResponse.data?.data) 
          ? watchedResponse.data.data 
          : Array.isArray(watchedResponse.data) 
            ? watchedResponse.data 
            : []

        // Récupérer les avis
        const reviewsResponse = await axios.get(
          `http://localhost:3000/api/v1/reviews`
        )
        const reviews = Array.isArray(reviewsResponse.data?.data)
          ? reviewsResponse.data.data
          : Array.isArray(reviewsResponse.data)
            ? reviewsResponse.data
            : []
        const userReviews = reviews.filter((r) => r.userId === user.id) || []

        // Calculer la moyenne des notes
        const moyenneNotes = userReviews.length > 0
          ? (userReviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) / userReviews.length).toFixed(1)
          : 0

        setStats({
          filmsVus: watchedMovies.length,
          avisPublies: userReviews.length,
          filmsFavoris: 0, // À implémenter si vous avez une table de favoris
          moyenneNotes: parseFloat(moyenneNotes) || 0
        })
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error.response?.status, error.message)
        // Garder les valeurs par défaut en cas d'erreur
        setStats({
          filmsVus: 0,
          avisPublies: 0,
          filmsFavoris: 0,
          moyenneNotes: 0
        })
      } finally {
        setIsLoadingStats(false)
      }
    }

    if (user?.id) {
      loadStats()
    }
  }, [user?.id])

  // Activité récente simulée
  const recentActivity = [
    {
      id: 1,
      type: 'review',
      movie: 'Dune: Part Two',
      content: 'A noté 5 étoiles',
      date: '2024-03-01',
      icon: Star
    },
    {
      id: 2,
      type: 'watched',
      movie: 'Oppenheimer',
      content: 'A marqué comme vu',
      date: '2024-02-28',
      icon: Eye
    },
    {
      id: 3,
      type: 'review',
      movie: 'The Batman',
      content: 'A publié un avis',
      date: '2024-02-25',
      icon: MessageCircle
    },
    {
      id: 4,
      type: 'favorite',
      movie: 'Parasite',
      content: 'A ajouté aux favoris',
      date: '2024-02-20',
      icon: Star
    }
  ]

  const handleSave = async () => {
    setIsLoadingSave(true)
    try {
      const userData = {
        username: editForm.username,
        biographie: editForm.biographie
      }
      
      const response = await axios.put(
        `http://localhost:3000/api/v1/users/${user.id}`,
        userData
      )

      if (response.status === 200) {
        toast.success('Profil mis à jour avec succès!')
        // Update local user context if needed
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la mise à jour du profil')
    } finally {
      setIsLoadingSave(false)
    }
  }

  const handleCancel = () => {
    setEditForm({
      username: user?.username || '',
      biographie: user?.biographie || 'Passionné de cinéma et de critiques constructives. J\'aime découvrir de nouveaux films et partager mes impressions avec la communauté.'
    })
    setIsEditing(false)
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordError({})

    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError({ all: 'Tous les champs sont requis' })
      return
    }

    if (passwordForm.newPassword.length < 2) {
      setPasswordError({ new: 'Le mot de passe doit contenir au moins 2 caractères' })
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError({ confirm: 'Les mots de passe ne correspondent pas' })
      return
    }

    setIsLoadingPassword(true)
    try {
      // Vérifier le mot de passe actuel en essayant de login
      const loginResponse = await axios.post(
        'http://localhost:3000/api/v1/login',
        {
          identifier: user.email,
          password: passwordForm.currentPassword
        }
      )

      if (loginResponse.status === 200) {
        // Mot de passe actuel correct, mise à jour du nouveau
        const updateResponse = await axios.put(
          `http://localhost:3000/api/v1/reset-password/${user.id}`,
          { mot_de_passe: passwordForm.newPassword }
        )

        if (updateResponse.status === 200) {
          toast.success('Mot de passe modifié avec succès!')
          setIsChangingPassword(false)
          setPasswordForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          })
        }
      }
    } catch (error) {
      console.error('Erreur:', error)
      if (error.response?.status === 401) {
        setPasswordError({ current: 'Mot de passe actuel incorrect' })
      } else {
        toast.error('Erreur lors de la modification du mot de passe')
      }
    } finally {
      setIsLoadingPassword(false)
    }
  }

  return (
    <div className={`min-h-screen ${bgMain} ${textMain} transition-colors duration-300`}>
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header du profil */}
        <div className={`${bgCard} rounded-lg p-6 mb-8 shadow-lg`}>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className={`w-24 h-24 rounded-full ${isDark ? 'bg-[#2c3440]' : 'bg-gray-300'} flex items-center justify-center`}>
                <User className={`h-12 w-12 ${textSecondary}`} />
              </div>
              {isEditing && (
                <button className={`absolute bottom-0 right-0 ${accentBg} text-black p-1 rounded-full hover:opacity-90 transition-colors`}>
                  <Edit className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Informations */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${inputBg} ${borderColor} ${textMain} focus:outline-none focus:ring-2 focus:ring-[#00e054]`}
                    placeholder="Nom d'utilisateur"
                    disabled={isLoadingSave}
                  />
                  <textarea
                    value={editForm.biographie}
                    onChange={(e) => setEditForm({...editForm, biographie: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${inputBg} ${borderColor} ${textMain} focus:outline-none focus:ring-2 focus:ring-[#00e054]`}
                    rows={3}
                    placeholder="Biographie"
                    disabled={isLoadingSave}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={isLoadingSave}
                      className={`px-4 py-2 ${accentBg} text-black rounded-lg hover:opacity-90 transition-colors flex items-center disabled:opacity-50`}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoadingSave ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isLoadingSave}
                      className={`px-4 py-2 border ${borderColor} ${textSecondary} rounded-lg ${hoverBg} transition-colors flex items-center disabled:opacity-50`}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold mb-2">{user?.username}</h1>
                  <p className={`mb-4 ${textSecondary}`}>
                    {editForm.biographie}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`px-4 py-2 ${accentBg} text-black rounded-lg hover:opacity-90 transition-colors flex items-center`}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier le profil
                    </button>
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Changer le mot de passe
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal Changer mot de passe */}
        {isChangingPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${bgCard} rounded-lg p-6 max-w-md w-full shadow-xl`}>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Lock className="h-6 w-6 mr-2" />
                Changer le mot de passe
              </h2>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-1`}>
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${inputBg} ${borderColor} ${textMain} focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
                    placeholder="Votre mot de passe actuel"
                    disabled={isLoadingPassword}
                  />
                  {passwordError.current && (
                    <p className="text-red-500 text-sm mt-1">{passwordError.current}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-1`}>
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${inputBg} ${borderColor} ${textMain} focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
                    placeholder="Nouveau mot de passe"
                    disabled={isLoadingPassword}
                  />
                  {passwordError.new && (
                    <p className="text-red-500 text-sm mt-1">{passwordError.new}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-1`}>
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${inputBg} ${borderColor} ${textMain} focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
                    placeholder="Confirmer le mot de passe"
                    disabled={isLoadingPassword}
                  />
                  {passwordError.confirm && (
                    <p className="text-red-500 text-sm mt-1">{passwordError.confirm}</p>
                  )}
                </div>

                {passwordError.all && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {passwordError.all}
                  </div>
                )}

                <div className="flex space-x-2 pt-4">
                  <button
                    type="submit"
                    disabled={isLoadingPassword}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isLoadingPassword ? 'Modification...' : 'Modifier'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false)
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                      setPasswordError({})
                    }}
                    disabled={isLoadingPassword}
                    className={`flex-1 px-4 py-2 border ${borderColor} ${textSecondary} rounded-lg ${hoverBg} transition-colors disabled:opacity-50`}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className={`${bgCard} rounded-lg p-6 text-center shadow-lg`}>
            <Eye className={`h-8 w-8 ${accentColor} mx-auto mb-2`} />
            <div className="text-2xl font-bold">{stats.filmsVus}</div>
            <div className={`text-sm ${textSecondary}`}>Films vus</div>
          </div>
          <div className={`${bgCard} rounded-lg p-6 text-center shadow-lg`}>
            <MessageCircle className={`h-8 w-8 ${accentColor} mx-auto mb-2`} />
            <div className="text-2xl font-bold">{stats.avisPublies}</div>
            <div className={`text-sm ${textSecondary}`}>Avis publiés</div>
          </div>
          <div className={`${bgCard} rounded-lg p-6 text-center shadow-lg`}>
            <Star className={`h-8 w-8 ${accentColor} mx-auto mb-2`} />
            <div className="text-2xl font-bold">{stats.filmsFavoris}</div>
            <div className={`text-sm ${textSecondary}`}>Films favoris</div>
          </div>
          <div className={`${bgCard} rounded-lg p-6 text-center shadow-lg`}>
            <div className="flex items-center justify-center mb-2">
              <Star className={`h-8 w-8 ${accentColor} fill-current`} />
            </div>
            <div className="text-2xl font-bold">{stats.moyenneNotes}</div>
            <div className={`text-sm ${textSecondary}`}>Note moyenne</div>
          </div>
        </div>

        {/* Activité récente */}
        <div className={`${bgCard} rounded-lg p-6 shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-6 flex items-center`}>
            <Calendar className={`h-6 w-6 mr-2 ${accentColor}`} />
            Activité récente
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className={`flex items-center space-x-4 p-4 rounded-lg ${hoverBg} hover:shadow-md transition-shadow`}>
                <div className={`p-2 rounded-full ${activity.type === 'review' ? 'bg-yellow-100 text-yellow-600' : activity.type === 'watched' ? 'bg-blue-100 text-blue-600' : activity.type === 'favorite' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  <activity.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    <span className={accentColor}>{activity.movie}</span> - {activity.content}
                  </p>
                  <p className={`text-sm ${textSecondary}`}>
                    {new Date(activity.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bouton de déconnexion */}
        <div className="mt-8 text-center">
          <button
            onClick={logout}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  )
}
