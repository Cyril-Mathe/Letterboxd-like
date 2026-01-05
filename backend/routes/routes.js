// routes
import express from "express";
import { getActors, getActorsById, createActors, modifyActors, deleteActors } from "../controllers/Actors/actorsControllers.js";
import { getDirectors, getDirectorsById, createDirectors, modifyDirectors, deleteDirectors } from "../controllers/Directors/directorsControllers.js";
import { getCategories, getCategoriesById, createCategories, modifyCategories, deleteCategories } from "../controllers/Categories/categoriesControllers.js";
import { getMovies, getMoviesById, createMovies, modifyMovies, deleteMovies } from "../controllers/Movies/moviesControllers.js";

const router = express.Router()

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

export default router;