import express from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/User/users.ts";
import { getMovies, getMovieById, createMovie, updateMovie, deleteMovie } from "../controllers/Movies/movies.ts";
import { getWatchedMovies, checkIfWatched, markAsWatched, unmarkAsWatched } from "../controllers/Movies/watchedMovies.ts";
import { getReviews, getReviewById, createReview, updateReview, deleteReview } from "../controllers/Reviews/reviews.ts";
import { register, login, me } from "../controllers/User/auth.ts";

const router = express.Router();

// auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', me);

// routes users
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// routes movies
router.get('/movies', getMovies);
router.get('/movies/:id', getMovieById);
router.post('/movies', createMovie);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);

// routes watched movies
router.get('/watched-movies', getWatchedMovies);
router.get('/watched-movies/check/:userId/:imdbID', checkIfWatched);
router.post('/watched-movies', markAsWatched);
router.delete('/watched-movies/:userId/:imdbID', unmarkAsWatched);

// routes reviews
router.get('/reviews', getReviews);
router.get('/reviews/:id', getReviewById);
router.post('/reviews', createReview);
router.put('/reviews/:id', updateReview);
router.delete('/reviews/:id', deleteReview);

export default router;