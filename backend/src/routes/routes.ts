import express from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/User/users.ts";
import { getWatchedMovies, checkIfWatched, markAsWatched, unmarkAsWatched } from "../controllers/Movies/watchedMovies.ts";
import { getReviews, getReviewById, getReviewsByImdbID, createReview, updateReview, deleteReview, deleteReviewByUserAndImdbID } from "../controllers/Reviews/reviews.ts";
import { register, login, me } from "../controllers/User/auth.ts";
import { followUser, unfollowUser, getFollowing, getFollowers, searchUsers, checkFollowStatus } from "../controllers/User/follows.ts";
import { getConversationHandler } from "../controllers/User/chat.ts";
import { authenticateToken } from "../middleware/auth.ts";

const router = express.Router();

// auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', me);

// routes users
router.get('/users', getUsers);
router.get('/users/search', authenticateToken, searchUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// routes movies
router.get('/watched-movies', getWatchedMovies);
router.get('/watched-movies/check/:userId/:imdbID', checkIfWatched);
router.post('/watched-movies', markAsWatched);
router.delete('/watched-movies/:userId/:imdbID', unmarkAsWatched);

// routes reviews
router.get('/reviews', getReviews);
router.get('/reviews/imdb/:imdbID', getReviewsByImdbID);
router.get('/reviews/:id', getReviewById);
router.post('/reviews', createReview);
router.put('/reviews/:id', updateReview);
router.delete('/reviews/:id', deleteReview);
router.delete('/reviews/user/:userId/:imdbID', deleteReviewByUserAndImdbID);

// routes follows
router.post('/follow', authenticateToken, followUser);
router.delete('/follow/:followerId/:followedId', authenticateToken, unfollowUser);
router.get('/following/:userId', authenticateToken, getFollowing);
router.get('/followers/:userId', authenticateToken, getFollowers);
router.get('/users/search', authenticateToken, searchUsers);
router.get('/follow/status/:followerId/:followedId', authenticateToken, checkFollowStatus);
router.get('/chat/history/:userId/:friendId', authenticateToken, getConversationHandler);

export default router;