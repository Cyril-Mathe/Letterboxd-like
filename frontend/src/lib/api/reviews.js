/**
 * Reviews API functions
 * Handles all CRUD operations for reviews
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/**
 * Fetch all reviews
 */
export async function getReviews() {
  const response = await fetch(`${API_BASE_URL}/api/reviews`)
  if (!response.ok) {
    throw new Error('Failed to fetch reviews')
  }
  return response.json()
}

/**
 * Fetch reviews for a specific film
 */
export async function getFilmReviews(filmId, page = 1, pageSize = 20) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/film/${filmId}?page=${page}&pageSize=${pageSize}`)
  if (!response.ok) {
    throw new Error('Failed to fetch film reviews')
  }
  return response.json()
}

/**
 * Fetch a single review by ID
 */
export async function getReview(reviewId) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch review')
  }
  return response.json()
}

/**
 * Fetch reviews by a specific user
 */
export async function getUserReviews(userId) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/user/${userId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch user reviews')
  }
  return response.json()
}

/**
 * Create a new review
 */
export async function createReview(input) {
  const response = await fetch(`${API_BASE_URL}/api/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    throw new Error('Failed to create review')
  }
  return response.json()
}

/**
 * Update an existing review
 */
export async function updateReview(reviewId, input) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    throw new Error('Failed to update review')
  }
  return response.json()
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete review')
  }
  return response.json()
}

/**
 * Like a review
 */
export async function likeReview(reviewId) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}/like`, {
    method: 'POST',
  })
  if (!response.ok) {
    throw new Error('Failed to like review')
  }
  return response.json()
}

/**
 * Get likes for a review
 */
export async function getReviewLikes(reviewId) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}/likes`)
  if (!response.ok) {
    throw new Error('Failed to fetch review likes')
  }
  return response.json()
}

/**
 * Comment on a review
 */
export async function commentOnReview(reviewId, commentText) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ comment: commentText }),
  })
  if (!response.ok) {
    throw new Error('Failed to comment on review')
  }
  return response.json()
}

/**
 * Get comments for a review
 */
export async function getReviewComments(reviewId) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}/comments`)
  if (!response.ok) {
    throw new Error('Failed to fetch review comments')
  }
  return response.json()
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/comments/${commentId}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete comment')
  }
  return response.json()
}
