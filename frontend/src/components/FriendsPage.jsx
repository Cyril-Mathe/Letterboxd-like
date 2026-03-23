import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../contexts'
import { Search, UserPlus, UserMinus, Users } from 'lucide-react'

const FriendsPage = () => {
  const { user } = useContext(AuthContext)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [following, setFollowing] = useState([])
  const [followers, setFollowers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchFollowing()
      fetchFollowers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const fetchFollowing = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/v1/following/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFollowing(data);
      }
    } catch (error) {
      console.error('Error fetching following:', error);
    }
  }

  const fetchFollowers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/v1/followers/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFollowers(data);
      }
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  }

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/v1/users/search?query=${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data
          .filter(u => u.id !== user.id)
          .map((u) => ({
            ...u,
            isFollowing: following.some(f => f.id === u.id)
          }))
        )
      }
    } catch (error) {
      console.error('Error searching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const followUser = async (followedId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/v1/follow', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ followerId: user.id, followedId })
      })

      if (response.ok) {
        await fetchFollowing() // Refresh following list
        if (searchQuery.trim()) {
          searchUsers(searchQuery)
        }
      }
    } catch (error) {
      console.error('Error following user:', error)
    }
  }

  const unfollowUser = async (followedId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/v1/follow/${user.id}/${followedId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        await fetchFollowing() // Refresh following list
        if (searchQuery.trim()) {
          searchUsers(searchQuery)
        }
      }
    } catch (error) {
      console.error('Error unfollowing user:', error)
    }
  }

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    searchUsers(query)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Users className="w-8 h-8" />
        Friends
      </h1>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Search Results */}
        {loading && <p className="mt-2 text-sm text-gray-500">Chargement...</p>}
        {searchResults.length > 0 && (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm max-w-md">
            {searchResults.map((resultUser) => (
              <div key={resultUser.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {resultUser.avatar_url ? (
                      <img src={resultUser.avatar_url} alt={resultUser.username} className="w-10 h-10 rounded-full" />
                    ) : (
                      <span className="text-gray-600 font-medium">{resultUser.username[0].toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{resultUser.username}</p>
                    <p className="text-sm text-gray-500">{resultUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const isFollowing = following.some(f => f.id === resultUser.id);
                    isFollowing ? unfollowUser(resultUser.id) : followUser(resultUser.id);
                  }}
                  className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium ${
                    following.some(f => f.id === resultUser.id)
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {following.some(f => f.id === resultUser.id) ? (
                    <>
                      <UserMinus className="w-4 h-4" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Follow
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Following */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Following ({following.length})</h2>
          {following.length === 0 ? (
            <p className="text-gray-500">You're not following anyone yet.</p>
          ) : (
            <div className="space-y-3">
              {following.map((followedUser) => (
                <div key={followedUser.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {followedUser.avatar_url ? (
                      <img src={followedUser.avatar_url} alt={followedUser.username} className="w-10 h-10 rounded-full" />
                    ) : (
                      <span className="text-gray-600 font-medium">{followedUser.username[0].toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{followedUser.username}</p>
                    <p className="text-sm text-gray-500">{followedUser.email}</p>
                  </div>
                  <button
                    onClick={() => unfollowUser(followedUser.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Unfollow"
                  >
                    <UserMinus className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Followers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Followers ({followers.length})</h2>
          {followers.length === 0 ? (
            <p className="text-gray-500">No one is following you yet.</p>
          ) : (
            <div className="space-y-3">
              {followers.map((followerUser) => (
                <div key={followerUser.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {followerUser.avatar_url ? (
                      <img src={followerUser.avatar_url} alt={followerUser.username} className="w-10 h-10 rounded-full" />
                    ) : (
                      <span className="text-gray-600 font-medium">{followerUser.username[0].toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{followerUser.username}</p>
                    <p className="text-sm text-gray-500">{followerUser.email}</p>
                  </div>
                  {!following.some(f => f.id === followerUser.id) && (
                    <button
                      onClick={() => followUser(followerUser.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Follow Back
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FriendsPage