import { createFileRoute } from '@tanstack/react-router'
import { useContext, useState, useRef, useEffect } from 'react'
import { ThemeContext, AuthContext } from '../contexts'
import { Send, MessageCircle, Search } from 'lucide-react'

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

  // Theme-based classes
  const bgMain = isDark ? 'bg-[#14181c]' : 'bg-gray-50'
  const bgCard = isDark ? 'bg-[#1c2228]' : 'bg-white'
  const borderColor = isDark ? 'border-[#2c3440]' : 'border-gray-200'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-[#9ab]' : 'text-gray-600'
  const accentColor = isDark ? 'text-[#00e054]' : 'text-green-600'
  const accentBg = isDark ? 'bg-[#00e054]' : 'bg-green-600'
  const inputBg = isDark ? 'bg-[#1c2228]' : 'bg-white'
  const hoverBg = isDark ? 'hover:bg-[#2c3440]' : 'hover:bg-gray-100'

  const users = [
    { id: 1, username: 'FilmBuff92', avatar: 'https://placehold.co/40x40/4a4a4a/ffffff?text=FB', status: 'online', lastMessage: 'As-tu vu le dernier Nolan ?', lastMessageTime: '10:30' },
    { id: 2, username: 'Cinephile_Paris', avatar: 'https://placehold.co/40x40/5a5a5a/ffffff?text=CP', status: 'online', lastMessage: 'Oppenheimer est incroyable !', lastMessageTime: '09:45' },
    { id: 3, username: 'MovieLover', avatar: 'https://placehold.co/40x40/6a6a4a/ffffff?text=ML', status: 'offline', lastMessage: 'Quel est ton film préféré ?', lastMessageTime: 'Hier' },
    { id: 4, username: 'CinemaAddict', avatar: 'https://placehold.co/40x40/7a7a7a/ffffff?text=CA', status: 'online', lastMessage: 'Les effets spéciaux de Dune...', lastMessageTime: '08:20' },
    { id: 5, username: 'FilmCritic', avatar: 'https://placehold.co/40x40/8a8a8a/ffffff?text=FC', status: 'offline', lastMessage: 'Analyse du dernier Scorsese', lastMessageTime: '2 jours' }
  ]

  const [messages, setMessages] = useState([
    { id: 1, sender: 'FilmBuff92', content: 'Salut ! As-tu vu Oppenheimer récemment ?', timestamp: '10:25', isMine: false },
    { id: 2, sender: user?.username || 'Vous', content: "Oui, je l'ai vu hier ! Quelle réalisation incroyable.", timestamp: '10:26', isMine: true },
    { id: 3, sender: 'FilmBuff92', content: "Totalement d'accord. Nolan maîtrise parfaitement son sujet.", timestamp: '10:27', isMine: false },
    { id: 4, sender: 'FilmBuff92', content: 'Et toi, quels sont tes films préférés de cette année ?', timestamp: '10:28', isMine: false }
  ])

  const filteredUsers = users.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()))

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser) return
    const newMessage = { id: messages.length + 1, sender: user?.username || 'Vous', content: message, timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), isMine: true }
    setMessages([...messages, newMessage])
    setMessage('')
    setTimeout(() => {
      const responses = ['Intéressant !', 'Tu as raison !', 'Je vais regarder ça.', 'Quelle scène t\'a marqué ?']
      const responseMessage = { id: messages.length + 2, sender: selectedUser.username, content: responses[Math.floor(Math.random() * responses.length)], timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), isMine: false }
      setMessages(prev => [...prev, responseMessage])
    }, 1500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage() }
  }

  if (!user) {
    return (
      <div className={`min-h-screen ${bgMain} flex items-center justify-center`}>
        <div className={`text-center p-8 rounded-lg ${bgCard} shadow-lg`}>
          <MessageCircle className={`h-16 w-16 ${textSecondary} mx-auto mb-4`} />
          <h2 className={`text-2xl font-bold mb-2 ${textMain}`}>Connexion requise</h2>
          <p className={textSecondary}>Vous devez être connecté pour accéder aux discussions</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`h-screen ${bgMain} ${textMain} flex`}>
      {/* Sidebar */}
      <div className={`hidden md:flex md:flex-col w-80 ${bgCard} ${borderColor} border-r`}>
        <div className={`p-4 ${borderColor} border-b`}>
          <h2 className="text-xl font-bold mb-4">Discussions</h2>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${textSecondary}`} />
            <input type="text" placeholder="Rechercher..." className={`w-full pl-10 pr-4 py-2 ${inputBg} ${borderColor} border rounded-md ${textMain} placeholder:${textSecondary} text-sm focus:outline-none focus:border-[#00e054]`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((u) => (
            <div key={u.id} onClick={() => setSelectedUser(u)} className={`p-4 cursor-pointer ${borderColor} border-b ${hoverBg} transition-colors ${selectedUser?.id === u.id ? (isDark ? 'bg-[#2c3440]' : 'bg-gray-100') : ''}`}>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img src={u.avatar} alt={u.username} className="w-10 h-10 rounded-full" />
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 ${bgCard} ${u.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{u.username}</p>
                    <span className={`text-xs ${textSecondary}`}>{u.lastMessageTime}</span>
                  </div>
                  <p className={`text-sm ${textSecondary} truncate`}>{u.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className={`p-4 ${borderColor} border-b ${bgCard}`}>
              <div className="flex items-center space-x-3">
                <img src={selectedUser.avatar} alt={selectedUser.username} className="w-10 h-10 rounded-full" />
                <div>
                  <h3 className="font-medium">{selectedUser.username}</h3>
                  <p className={`text-sm ${textSecondary}`}>{selectedUser.status === 'online' ? 'En ligne' : 'Hors ligne'}</p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.isMine ? `${accentBg} text-black` : `${bgCard} ${textMain}`} shadow`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.isMine ? 'text-black/60' : textSecondary}`}>{msg.timestamp}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className={`p-4 ${borderColor} border-t ${bgCard}`}>
              <div className="flex space-x-3">
                <input type="text" placeholder="Tapez votre message..." className={`flex-1 px-4 py-2 ${inputBg} ${borderColor} border rounded-lg ${textMain} placeholder:${textSecondary} text-sm focus:outline-none focus:border-[#00e054]`} value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={handleKeyPress} />
                <button onClick={handleSendMessage} disabled={!message.trim()} className={`px-4 py-2 ${accentBg} text-black rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}>
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className={`h-16 w-16 ${textSecondary} mx-auto mb-4`} />
              <h3 className="text-xl font-medium mb-2">Sélectionnez une discussion</h3>
              <p className={`text-sm ${textSecondary}`}>Choisissez un utilisateur pour commencer à discuter</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Nav */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 ${bgCard} ${borderColor} border-t`}>
        <div className="flex">
          {filteredUsers.slice(0, 4).map((u) => (
            <button key={u.id} onClick={() => setSelectedUser(u)} className={`flex-1 p-3 text-center ${selectedUser?.id === u.id ? `${accentBg} text-black` : ''}`}>
              <img src={u.avatar} alt={u.username} className="w-8 h-8 rounded-full mx-auto mb-1" />
              <p className="text-xs truncate">{u.username}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
