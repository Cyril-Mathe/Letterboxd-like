import { createFileRoute, redirect } from '@tanstack/react-router'
import { useContext, useState } from 'react'
import { ThemeContext, AuthContext } from '../contexts'
import { User, Star, Eye, MessageCircle, Calendar, Edit, Save, X } from 'lucide-react'

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
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    bio: 'Passionné de cinéma et de critiques constructives. J\'aime découvrir de nouveaux films et partager mes impressions avec la communauté.'
  })

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

  // Données simulées pour les statistiques
  const stats = {
    filmsVus: 47,
    avisPublies: 23,
    filmsFavoris: 12,
    moyenneNotes: 4.1
  }

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

  const handleSave = () => {
    // Simulation de sauvegarde
    console.log('Sauvegarde du profil:', editForm)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm({
      username: user?.username || '',
      bio: 'Passionné de cinéma et de critiques constructives. J\'aime découvrir de nouveaux films et partager mes impressions avec la communauté.'
    })
    setIsEditing(false)
  }

  return (
    <div className={`min-h-screen ${bgMain} ${textMain} transition-colors duration-300`}>
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
                  />
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${inputBg} ${borderColor} ${textMain} focus:outline-none focus:ring-2 focus:ring-[#00e054]`}
                    rows={3}
                    placeholder="Biographie"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className={`px-4 py-2 ${accentBg} text-black rounded-lg hover:opacity-90 transition-colors flex items-center`}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </button>
                    <button
                      onClick={handleCancel}
                      className={`px-4 py-2 border ${borderColor} ${textSecondary} rounded-lg ${hoverBg} transition-colors flex items-center`}
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
                    Passionné de cinéma et de critiques constructives. J'aime découvrir de nouveaux films et partager mes impressions avec la communauté.
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`px-4 py-2 ${accentBg} text-black rounded-lg hover:opacity-90 transition-colors flex items-center`}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier le profil
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

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
