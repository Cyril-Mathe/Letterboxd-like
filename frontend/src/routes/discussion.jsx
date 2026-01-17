import { createFileRoute } from '@tanstack/react-router'
import { useContext, useState, useRef, useEffect } from 'react'
import { ThemeContext, AuthContext } from '../contexts'
import { Send, User, MessageCircle, Search } from 'lucide-react'

export const Route = createFileRoute('/discussion')({
  component: Discussion,
})

function Discussion() {
  const { isDark } = useContext(ThemeContext)
  const { user } = useContext(AuthContext)
  const [selectedUser, setSelectedUser] = useState(null)
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef(null)

  // Données simulées d'utilisateurs
  const users = [
    {
      id: 1,
      username: 'FilmBuff92',
      avatar: 'https://via.placeholder.com/40x40/4a4a4a/ffffff?text=FB',
      status: 'online',
      lastMessage: 'As-tu vu le dernier Nolan ?',
      lastMessageTime: '10:30'
    },
    {
      id: 2,
      username: 'Cinephile_Paris',
      avatar: 'https://via.placeholder.com/40x40/5a5a5a/ffffff?text=CP',
      status: 'online',
      lastMessage: 'Oppenheimer est incroyable !',
      lastMessageTime: '09:45'
    },
    {
      id: 3,
      username: 'MovieLover',
      avatar: 'https://via.placeholder.com/40x40/6a6a4a/ffffff?text=ML',
      status: 'offline',
      lastMessage: 'Quel est ton film préféré ?',
      lastMessageTime: 'Hier'
    },
    {
      id: 4,
      username: 'CinemaAddict',
      avatar: 'https://via.placeholder.com/40x40/7a7a7a/ffffff?text=CA',
      status: 'online',
      lastMessage: 'Les effets spéciaux de Dune...',
      lastMessageTime: '08:20'
    },
    {
      id: 5,
      username: 'FilmCritic',
      avatar: 'https://via.placeholder.com/40x40/8a8a8a/ffffff?text=FC',
      status: 'offline',
      lastMessage: 'Analyse du dernier Scorsese',
      lastMessageTime: '2 jours'
    }
  ]

  // Messages simulés pour l'utilisateur sélectionné
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'FilmBuff92',
      content: 'Salut ! As-tu vu Oppenheimer récemment ?',
      timestamp: '10:25',
      isMine: false
    },
    {
      id: 2,
      sender: user?.username || 'Vous',
      content: 'Oui, je l\'ai vu hier ! Quelle réalisation incroyable.',
      timestamp: '10:26',
      isMine: true
    },
    {
      id: 3,
      sender: 'FilmBuff92',
      content: 'Totalement d\'accord. Nolan maîtrise parfaitement son sujet.',
      timestamp: '10:27',
      isMine: false
    },
    {
      id: 4,
      sender: 'FilmBuff92',
      content: 'Et toi, quels sont tes films préférés de cette année ?',
      timestamp: '10:28',
      isMine: false
    }
  ])

  // Filtrage des utilisateurs
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser) return

    const newMessage = {
      id: messages.length + 1,
      sender: user?.username || 'Vous',
      content: message,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isMine: true
    }

    setMessages([...messages, newMessage])
    setMessage('')

    // Simulation de réponse automatique
    setTimeout(() => {
      const responses = [
        'Intéressant ! Je n\'y avais pas pensé.',
        'Tu as raison, c\'est un excellent film.',
        'Je vais regarder ça ce weekend.',
        'Quelle scène t\'a le plus marqué ?',
        'Je suis tout à fait d\'accord avec toi !'
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const responseMessage = {
        id: messages.length + 2,
        sender: selectedUser.username,
        content: randomResponse,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        isMine: false
      }

      setMessages(prev => [...prev, responseMessage])
    }, 1000 + Math.random() * 2000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`text-center p-8 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connexion requise</h2>
          <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Vous devez être connecté pour accéder aux discussions
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`h-screen flex ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar utilisateurs - Desktop */}
      <div className={`hidden md:flex md:flex-col w-80 ${isDark ? 'bg-gray-800' : 'bg-white'} border-r ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        {/* Header */}
        <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className="text-xl font-bold mb-4">Discussions</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              onClick={() => setSelectedUser(u)}
              className={`p-4 cursor-pointer border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              } transition-colors ${
                selectedUser?.id === u.id ? (isDark ? 'bg-gray-700' : 'bg-gray-100') : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={u.avatar}
                    alt={u.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 ${
                    isDark ? 'border-gray-800' : 'border-white'
                  } ${
                    u.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{u.username}</p>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {u.lastMessageTime}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {u.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone de discussion */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Header de la discussion */}
            <div className={`p-4 border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center space-x-3">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{selectedUser.username}</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedUser.status === 'online' ? 'En ligne' : 'Hors ligne'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.isMine
                        ? 'bg-green-500 text-white'
                        : isDark
                          ? 'bg-gray-700 text-white'
                          : 'bg-white text-gray-900'
                    } shadow`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.isMine ? 'text-green-100' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Zone d'envoi */}
            <div className={`p-4 border-t ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Tapez votre message..."
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* État vide */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Sélectionnez une discussion</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Choisissez un utilisateur dans la liste pour commencer à discuter
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation mobile en bas */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
        <div className="flex">
          {filteredUsers.slice(0, 4).map((u) => (
            <button
              key={u.id}
              onClick={() => setSelectedUser(u)}
              className={`flex-1 p-3 text-center ${
                selectedUser?.id === u.id ? 'bg-green-500 text-white' : ''
              }`}
            >
              <img
                src={u.avatar}
                alt={u.username}
                className="w-8 h-8 rounded-full mx-auto mb-1"
              />
              <p className="text-xs truncate">{u.username}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
