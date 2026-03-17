/**
 * Watched Movies API functions
 * Handles all operations for tracking watched movies
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/**
 * Get all watched movies for a user
 */
export async function getWatchedMovies(userId) {
  const response = await fetch(`${API_BASE_URL}/api/v1/watched-movies?userId=${userId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch watched movies')
  }
  return response.json()
}

/**
 * Check if a specific movie is watched by the user
 */
export async function checkIfWatched(userId, imdbID) {
  const response = await fetch(`${API_BASE_URL}/api/v1/watched-movies/check/${userId}/${imdbID}`)
  if (!response.ok) {
    throw new Error('Failed to check watched status')
  }
  return response.json()
}

/**
 * Mark a movie as watched
 */
export async function markAsWatched(userId, imdbID, title, posterUrl) {
  const response = await fetch(`${API_BASE_URL}/api/v1/watched-movies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId,
      imdbID,
      title,
      poster_url: posterUrl
    })
  })
  if (!response.ok) {
    throw new Error('Failed to mark movie as watched')
  }
  return response.json()
}

/**
 * Unmark a movie as watched
 */
export async function unmarkAsWatched(userId, imdbID) {
  const response = await fetch(`${API_BASE_URL}/api/v1/watched-movies/${userId}/${imdbID}`, {
    method: 'DELETE'
  })
  if (!response.ok) {
    throw new Error('Failed to unmark movie as watched')
  }
  return response.json()
}
