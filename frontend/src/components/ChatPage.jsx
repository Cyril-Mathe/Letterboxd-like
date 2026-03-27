import { useState, useEffect, useContext, useMemo, useRef } from 'react'
import { AuthContext, ThemeContext } from '../contexts'
import { io } from 'socket.io-client'
import { MessageSquare, Send, Users } from 'lucide-react'

const ChatPage = () => {
  const { user } = useContext(AuthContext)
  const { isDark } = useContext(ThemeContext)
  const [following, setFollowing] = useState([])
  const [followers, setFollowers] = useState([])
  const [mutualFriends, setMutualFriends] = useState([])
  const [selectedFriend, setSelectedFriend] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const socketRef = useRef(null)

  useEffect(() => {
    if (!user) return

    const token = localStorage.getItem('token')
    const socketClient = io('http://localhost:3000', {
      auth: { token }
    })

    socketClient.on('connect_error', (err) => {
      console.error('Socket connect error:', err.message)
    })

    socketClient.on('message', (message) => {
      setMessages((prev) => [...prev, message])
    })

    socketClient.on('joined', () => {
      // nothing to do; we can fetch history after join is done
    })

    socketRef.current = socketClient

    return () => {
      socketClient.disconnect()
      socketRef.current = null
    }
  }, [user])

  useEffect(() => {
    if (!user) return

    const token = localStorage.getItem('token')

    const fetchData = async () => {
      try {
        const [followingRes, followersRes] = await Promise.all([
          fetch(`http://localhost:3000/api/v1/following/${user.id}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`http://localhost:3000/api/v1/followers/${user.id}`, { headers: { Authorization: `Bearer ${token}` } }),
        ])

        if (!followingRes.ok || !followersRes.ok) return

        const followingData = await followingRes.json()
        const followersData = await followersRes.json()

        setFollowing(followingData)
        setFollowers(followersData)

        const mutual = followingData.filter((f) => followersData.some((fo) => fo.id === f.id))
        setMutualFriends(mutual)
      } catch (err) {
        console.error('Error fetching follow data:', err)
      }
    }

    fetchData()
  }, [user])

  const selectFriend = async (friend) => {
    setSelectedFriend(friend)
    setMessages([])

    const socket = socketRef.current
    if (!socket) return

    socket.emit('join', { friendId: friend.id })

    // Fetch conversation history
    const token = localStorage.getItem('token')
    const response = await fetch(`http://localhost:3000/api/v1/chat/history/${user.id}/${friend.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (response.ok) {
      const history = await response.json()
      setMessages(history)
    } else {
      const err = await response.json()
      console.error('Unable to fetch history:', err)
    }
  }

  const sendMessage = async () => {
    const socket = socketRef.current
    if (!newMessage.trim() || !selectedFriend || !socket) return

    socket.emit('message', { friendId: selectedFriend.id, content: newMessage.trim() })
    setNewMessage('')
  }

  const getMessageMeta = (msg) => {
    const isMine = msg.senderId === user.id
    const senderName = isMine ? (user?.username || 'Vous') : (selectedFriend?.username || 'Utilisateur')

    const createdAt = msg.createdAt ? new Date(msg.createdAt) : null
    if (!createdAt || Number.isNaN(createdAt.getTime())) {
      return senderName
    }

    const date = createdAt.toLocaleDateString('fr-FR')
    const time = createdAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    return `${senderName} • ${date} • ${time}`
  }

  const mutualList = useMemo(() => mutualFriends || [], [mutualFriends])
  const pageBg = isDark ? 'bg-[#14181c]' : 'bg-gray-50'
  const cardBg = isDark ? 'bg-[#1c2228]' : 'bg-white'
  const borderColor = isDark ? 'border-[#2c3440]' : 'border-gray-200'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-[#9ab]' : 'text-gray-600'
  const inputBg = isDark ? 'bg-[#14181c]' : 'bg-white'
  const bubbleOtherBg = isDark ? 'bg-[#2c3440]' : 'bg-gray-200'
  const bubbleOtherText = isDark ? 'text-white' : 'text-gray-800'
  const selectedFriendBg = isDark ? 'bg-[#2c3440]' : 'bg-blue-100'
  const hoverFriendBg = isDark ? 'hover:bg-[#2c3440]' : 'hover:bg-gray-100'

  if (!user) {
    return <div className={`p-6 ${textMain}`}>Veuillez vous connecter pour accéder au chat.</div>
  }

  return (
    <div className={`max-w-6xl mx-auto p-6 ${pageBg} ${textMain}`}>
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <MessageSquare className="w-8 h-8" /> Chat
      </h1>
      <div className={`mb-4 text-sm ${textSecondary}`}>
        <span className="mr-4">Following: {following.length}</span>
        <span>Followers: {followers.length}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className={`lg:col-span-1 ${cardBg} rounded-lg shadow p-4 border ${borderColor}`}>
          <h2 className="font-semibold mb-3">Amis mutuels</h2>
          {mutualList.length === 0 ? (
            <p className={textSecondary}>Aucun ami mutuel. Suivez quelqu’un et soyez suivi pour discuter.</p>
          ) : (
            <ul className="space-y-2">
              {mutualList.map((friend) => (
                <li key={friend.id}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded ${selectedFriend?.id === friend.id ? selectedFriendBg : hoverFriendBg}`}
                    onClick={() => selectFriend(friend)}
                  >
                    <Users className="inline-block w-4 h-4 mr-2 align-text-bottom" />
                    {friend.username}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`lg:col-span-3 ${cardBg} rounded-lg shadow p-4 border ${borderColor} flex flex-col h-[70vh]`}>
          <h2 className="font-semibold mb-3">Conversation {selectedFriend ? `avec ${selectedFriend.username}` : ''}</h2>

          <div className={`flex-1 overflow-y-auto p-3 border rounded-lg ${borderColor} ${inputBg}`}>
            {selectedFriend && messages.length === 0 && <p className={textSecondary}>Aucun message pour l'instant.</p>}
            {selectedFriend && messages.map((msg) => (
              <div key={msg.id} className={`mb-2 ${msg.senderId === user.id ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block px-3 py-2 rounded ${msg.senderId === user.id ? 'bg-blue-500 text-white' : `${bubbleOtherBg} ${bubbleOtherText}`}`}>
                  {msg.content}
                </span>
                <div className={`text-xs mt-1 ${textSecondary}`}>{getMessageMeta(msg)}</div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className={`flex-1 px-3 py-2 border rounded-lg ${borderColor} ${inputBg} ${textMain}`}
              placeholder={selectedFriend ? 'Écrire un message...' : 'Sélectionnez un ami pour commencer'}
              disabled={!selectedFriend}
              onKeyDown={(e) => { if (e.key === 'Enter') sendMessage() }}
            />
            <button
              onClick={sendMessage}
              disabled={!selectedFriend || !newMessage.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              <Send className="w-4 h-4 inline-block mr-1" /> Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
