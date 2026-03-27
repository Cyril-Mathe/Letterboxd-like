import { db } from "../../db"
import { watchedMoviesTable } from "../../model/schema"
import { eq, and } from "drizzle-orm"
import { Request, Response } from "express"

export async function getWatchedMovies(req: Request, res: Response) {
    try {
        const userId = Number(req.query.userId);
        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }
        
        const movies = await db
            .select()
            .from(watchedMoviesTable)
            .where(eq(watchedMoviesTable.userId, userId));
        
        res.json({ success: true, data: movies });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get watched movies" });
    }
}

export async function checkIfWatched(req: Request, res: Response) {
    try {
        const userId = Number(req.params.userId);
        const imdbID = req.params.imdbID;
        
        if (!userId || !imdbID) {
            return res.status(400).json({ error: "userId and imdbID are required" });
        }
        
        const watched = await db
            .select()
            .from(watchedMoviesTable)
            .where(and(
                eq(watchedMoviesTable.userId, userId),
                eq(watchedMoviesTable.imdbID, imdbID)
            ))
            .limit(1);
        
        res.json({ success: true, data: watched[0] || null });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to check watched movie" });
    }
}

export async function markAsWatched(req: Request, res: Response) {
    try {
        const { userId, imdbID, title, poster_url } = req.body;
        
        if (!userId || !imdbID || !title) {
            return res.status(400).json({ error: "userId, imdbID, and title are required" });
        }
        
        // Check if already watched
        const exists = await db
            .select()
            .from(watchedMoviesTable)
            .where(and(
                eq(watchedMoviesTable.userId, userId),
                eq(watchedMoviesTable.imdbID, imdbID)
            ))
            .limit(1);
        
        if (exists.length > 0) {
            return res.status(200).json({ success: true, message: "Movie already marked as watched" });
        }
        
        await db.insert(watchedMoviesTable).values({
            userId,
            imdbID,
            title,
            poster_url
        });
        
        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to mark movie as watched" });
    }
}

export async function unmarkAsWatched(req: Request, res: Response) {
    try {
        const userId = Number(req.params.userId);
        const imdbID = req.params.imdbID;
        
        if (!userId || !imdbID) {
            return res.status(400).json({ error: "userId and imdbID are required" });
        }
        
        await db
            .delete(watchedMoviesTable)
            .where(and(
                eq(watchedMoviesTable.userId, userId),
                eq(watchedMoviesTable.imdbID, imdbID)
            ));
        
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to unmark movie as watched" });
    }
}
