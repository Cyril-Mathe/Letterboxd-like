// routes
import express from "express";
import { getActors, getActorsById, createActors, modifyActors, deleteActors } from "../controllers/Actors/actorsControllers.js";

const router = express.Router()

// actors routes
router.get('/actors', getActors);
router.get('/actors/:id', getActorsById);
router.post('/actors', createActors);
router.put('/actors/:id', modifyActors);
router.delete('/actors/:id', deleteActors);

export default router;