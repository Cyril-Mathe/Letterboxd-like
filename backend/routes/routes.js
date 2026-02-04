// routes
import express from "express";
import { getActors, getActorsById, createActors, modifyActors, deleteActors } from "../controllers/Actors/actorsControllers.js";
import { getDirectors, getDirectorsById, createDirectors, modifyDirectors, deleteDirectors } from "../controllers/Directors/directorsControllers.js";
import { getCategories, getCategoriesById, createCategories, modifyCategories, deleteCategories } from "../controllers/Categories/categoriesControllers.js";
import { getMovies, getMoviesById, createMovies, modifyMovies, deleteMovies } from "../controllers/Movies/moviesControllers.js";
import { getReviews, getReviewsById, createReviews, modifyReviews, deleteReviews } from "../controllers/Reviews/reviewsControllers.js";
import { register, login, verify2FA, resetpassword, resend2FACodeHandler } from "../controllers/User/authControllers.js";
import { authenticate } from "../controllers/User/auth.js";

const router = express.Router()

// ROUTES AUTHENTIFICATION

router.post('/register', upload.single('charteFile'), register);
router.post('/login', login)
router.post('/verify2FA', verify2FA);
router.post("/resend2FA", resend2FACodeHandler);
router.post('/reset-password', resetpassword);
router.get('/profile', authenticate);

// actors routes
router.get('/actors', getActors);
router.get('/actors/:id', getActorsById);
router.post('/actors', createActors);
router.put('/actors/:id', modifyActors);
router.delete('/actors/:id', deleteActors);

// directors routes
router.get('/directors', getDirectors);
router.get('/directors/:id', getDirectorsById);
router.post('/directors', createDirectors);
router.put('/directors/:id', modifyDirectors);
router.delete('/directors/:id', deleteDirectors);

// categories routes
router.get('/categories', getCategories);
router.get('/categories/:id', getCategoriesById);
router.post('/categories', createCategories);
router.put('/categories/:id', modifyCategories);
router.delete('/categories/:id', deleteCategories);

// movies routes
router.get('/movies', getMovies);
router.get('/movies/:id', getMoviesById);
router.post('/movies', createMovies);
router.put('/movies/:id', modifyMovies);
router.delete('/movies/:id', deleteMovies);

// reviews routes
router.get('/reviews', getReviews);
router.get('/reviews/:id', getReviewsById);
router.post('/reviews', createReviews);
router.put('/reviews/:id', modifyReviews);
router.delete('/reviews/:id', deleteReviews);

export default router;