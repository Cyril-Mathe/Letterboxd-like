// routes
import express from "express";
import { getActors, getActorsById, createActors, modifyActors, deleteActors } from "../controllers/Actors/actorsControllers.js";
import { getDirectors, getDirectorsById, createDirectors, modifyDirectors, deleteDirectors } from "../controllers/Directors/directorsControllers.js";

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

export default router;