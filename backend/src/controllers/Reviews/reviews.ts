import { db } from "../../db"
import { reviewsTable } from "../../model/schema"
import { eq } from "drizzle-orm"
import { Request, Response } from "express"

export async function getReviews(req: Request, res: Response) {
    try {
        const reviews = await db.select().from(reviewsTable);
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

export async function createReview(req: Request, res: Response) {
    try {
        await db.insert(reviewsTable).values(req.body);
        res.status(201).json({ success: true });
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