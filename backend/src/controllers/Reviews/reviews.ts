import { db } from "../../db"
import { reviewsTable, usersTable, watchedMoviesTable } from "../../model/schema"
import { eq, and } from "drizzle-orm"
import { Request, Response } from "express"

export async function getReviews(req: Request, res: Response) {
    try {
        const reviews = await db
            .select({
                id: reviewsTable.id,
                userId: reviewsTable.userId,
                imdbID: reviewsTable.imdbID,
                rating: reviewsTable.rating,
                comment: reviewsTable.comment,
                createdAt: reviewsTable.createdAt,
                title: watchedMoviesTable.title,
                username: usersTable.username,
            })
            .from(reviewsTable)
            .leftJoin(
                watchedMoviesTable, 
                and(
                    eq(reviewsTable.userId, watchedMoviesTable.userId),
                    eq(reviewsTable.imdbID, watchedMoviesTable.imdbID)
                )
            )
            .leftJoin(usersTable, eq(reviewsTable.userId, usersTable.id));
        res.json({ success: true, data: reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get reviews" });
    }
}

export async function getReviewById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const review = await db.select().from(reviewsTable).where(eq(reviewsTable.id, id)).limit(1);
        res.json({ success: true, data: review[0] || null });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get review" });
    }
}

export async function getReviewsByImdbID(req: Request, res: Response) {
    try {
        const imdbID = req.params.imdbID;
        
        if (!imdbID) {
            return res.status(400).json({ error: "imdbID is required" });
        }
        
        const reviews = await db
            .select({
                id: reviewsTable.id,
                userId: reviewsTable.userId,
                rating: reviewsTable.rating,
                comment: reviewsTable.comment,
                createdAt: reviewsTable.createdAt,
                imdbID: reviewsTable.imdbID,
                username: usersTable.username,
            })
            .from(reviewsTable)
            .leftJoin(usersTable, eq(reviewsTable.userId, usersTable.id))
            .where(eq(reviewsTable.imdbID, imdbID));
        
        res.json({ success: true, data: reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get reviews by imdbID" });
    }
}

export async function createReview(req: Request, res: Response) {
    try {
        const { userId, imdbID, rating, comment } = req.body;
        
        if (!userId || !imdbID || !rating || !comment) {
            return res.status(400).json({ error: "userId, imdbID, rating, and comment are required" });
        }
        
        const review = await db.insert(reviewsTable).values({
            userId,
            imdbID,
            rating: parseFloat(rating),
            comment
        }).returning();
        
        res.status(201).json({ success: true, data: review[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create review" });
    }
}

export async function updateReview(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        await db.update(reviewsTable).set({ ...req.body, id }).where(eq(reviewsTable.id, id));
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update review" });
    }
}

export async function deleteReview(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        await db.delete(reviewsTable).where(eq(reviewsTable.id, id));
        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete review" });
    }
}

export async function deleteReviewByUserAndImdbID(req: Request, res: Response) {
    try {
        const userId = Number(req.params.userId);
        const imdbID = req.params.imdbID;
        
        if (!userId || !imdbID) {
            return res.status(400).json({ error: "userId and imdbID are required" });
        }
        
        await db
            .delete(reviewsTable)
            .where(and(
                eq(reviewsTable.userId, userId),
                eq(reviewsTable.imdbID, imdbID)
            ));
        
        res.json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete review" });
    }
}