/**
 * Reviews API functions
 * Handles all CRUD operations for reviews
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/**
 * Get all reviews
 */
export async function getReviews() {
  const response = await fetch(`${API_BASE_URL}/api/v1/reviews`)
  if (!response.ok) {
    throw new Error('Failed to fetch reviews')
  }
  return response.json()
}

/**
 * Get reviews for a specific movie by imdbID
 */
export async function getReviewsByImdbID(imdbID) {
  const response = await fetch(`${API_BASE_URL}/api/v1/reviews/imdb/${imdbID}`)
  if (!response.ok) {
    throw new Error('Failed to fetch reviews for this movie')
  }
  return response.json()
}

/**
 * Get a single review by ID
 */
export async function getReview(reviewId) {
  const response = await fetch(`${API_BASE_URL}/api/v1/reviews/${reviewId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch review')
  }
  return response.json()
}

/**
 * Create a new review
 */
export async function createReview(userId, imdbID, rating, comment) {
  const response = await fetch(`${API_BASE_URL}/api/v1/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId,
      imdbID,
      rating: parseFloat(rating),
      comment
    })
  })
  if (!response.ok) {
    throw new Error('Failed to create review')
  }
  return response.json()
}

/**
 * Update a review
 */
export async function updateReview(reviewId, rating, comment) {
  const response = await fetch(`${API_BASE_URL}/api/v1/reviews/${reviewId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      rating: parseFloat(rating),
      comment
    })
  })
  if (!response.ok) {
    throw new Error('Failed to update review')
  }
  return response.json()
}

/**
 * Delete a review by userId and imdbID
 */
export async function deleteReview(userId, imdbID) {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/reviews/user/${userId}/${imdbID}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete review');
  }

  return response.json();
}