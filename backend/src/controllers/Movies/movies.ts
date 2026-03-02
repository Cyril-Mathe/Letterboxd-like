import { db } from "../../db"
import { moviesTable } from "../../model/schema"
import { eq } from "drizzle-orm"
import { Request, Response } from "express"

export async function getMovies(req: Request, res: Response) {
    try {
        const movies = await db.select().from(moviesTable);
        res.json({ success: true, data: movies });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get movies" });
    }
}

export async function getMovieById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const movie = await db.select().from(moviesTable).where(eq(moviesTable.id, id)).limit(1);
        res.json({ success: true, data: movie[0] || null });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get movie" });
    }
}

export async function createMovie(req: Request, res: Response) {
    try {
        await db.insert(moviesTable).values(req.body);
        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create movie" });
    }
}

export async function updateMovie(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        await db.update(moviesTable).set({ ...req.body, id }).where(eq(moviesTable.id, id));
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update movie" });
    }
}

export async function deleteMovie(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        await db.delete(moviesTable).where(eq(moviesTable.id, id));
        res.json({ message: "Movie deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete movie" });
    }
}