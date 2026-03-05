/**
 * Custom hooks for review-related queries and mutations
 * 
 * Encapsulates all TanStack Query logic for reviews including
 * CRUD operations, likes, and comments.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFilmReviews,
  getReview,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview,
  likeReview,
  getReviewLikes,
  commentOnReview,
  getReviewComments,
  deleteComment,
} from '../lib/api/reviews';

/**
 * Fetch reviews for a specific film
 */
export function useFilmReviews(filmId, page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['reviews', 'film', filmId, page, pageSize],
    queryFn: () => getFilmReviews(filmId, page, pageSize),
    enabled: !!filmId,
  });
}

/**
 * Fetch a single review by ID
 */
export function useReview(reviewId) {
  return useQuery({
    queryKey: ['review', reviewId],
    queryFn: () => getReview(reviewId),
    enabled: !!reviewId,
  });
}

/**
 * Fetch reviews by a specific user
 */
export function useUserReviews(userId) {
  return useQuery({
    queryKey: ['reviews', 'user', userId],
    queryFn: () => getUserReviews(userId),
    enabled: !!userId,
  });
}

/**
 * Find user's existing review for a specific film
 * Returns the review if user has already reviewed this film, undefined otherwise
 */
export function useUserFilmReview(userId, filmId) {
  const { data: userReviews, isLoading, error } = useUserReviews(userId);

  const existingReview = userReviews?.find((review) => review.movie_id === filmId);

  return {
    existingReview,
    hasReviewed: !!existingReview,
    isLoading,
    error,
  };
}

/**
 * Create a new review mutation
 */
export function useCreateReview(filmId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input) => createReview(input),
    onSuccess: () => {
      // Invalidate film reviews and user reviews to refetch
      if (filmId) {
        queryClient.invalidateQueries({ queryKey: ['reviews', 'film', filmId] });
      }
      queryClient.invalidateQueries({ queryKey: ['reviews', 'user'] });
    },
  });
}

/**
 * Update an existing review mutation
 */
export function useUpdateReview(filmId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, input }) => updateReview(reviewId, input),
    onSuccess: () => {
      // Invalidate film reviews and the specific review
      if (filmId) {
        queryClient.invalidateQueries({ queryKey: ['reviews', 'film', filmId] });
      }
      queryClient.invalidateQueries({ queryKey: ['reviews', 'user'] });
    },
  });
}

/**
 * Delete a review mutation
 */
export function useDeleteReview(filmId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId) => deleteReview(reviewId),
    onSuccess: () => {
      // Invalidate film reviews and user reviews
      if (filmId) {
        queryClient.invalidateQueries({ queryKey: ['reviews', 'film', filmId] });
      }
      queryClient.invalidateQueries({ queryKey: ['reviews', 'user'] });
    },
  });
}

/**
 * Like a review mutation
 */
export function useLikeReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId) => likeReview(reviewId),
    onSuccess: () => {
      // Invalidate the likes for this review
      queryClient.invalidateQueries({ queryKey: ['reviews', 'likes'] });
    },
  });
}

/**
 * Fetch likes for a review
 */
export function useReviewLikes(reviewId) {
  return useQuery({
    queryKey: ['reviews', 'likes', reviewId],
    queryFn: () => getReviewLikes(reviewId),
    enabled: !!reviewId,
  });
}

/**
 * Comment on a review mutation
 */
export function useCommentOnReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, comment }) => commentOnReview(reviewId, comment),
    onSuccess: () => {
      // Invalidate comments for this review
      queryClient.invalidateQueries({ queryKey: ['reviews', 'comments'] });
    },
  });
}

/**
 * Fetch comments for a review
 */
export function useReviewComments(reviewId) {
  return useQuery({
    queryKey: ['reviews', 'comments', reviewId],
    queryFn: () => getReviewComments(reviewId),
    enabled: !!reviewId,
  });
}

/**
 * Delete a comment mutation
 */
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => deleteComment(commentId),
    onSuccess: () => {
      // Invalidate comments
      queryClient.invalidateQueries({ queryKey: ['reviews', 'comments'] });
    },
  });
}
