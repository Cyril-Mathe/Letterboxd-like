import { db } from "../../db"
import { reviewsTable } from "../../model/schema"
import { eq } from "drizzle-orm"
import { Review } from "../../model/schema"

export async function getReviews() {
    try {
        const reviews = await db.select().from(reviewsTable);
        return reviews;
    } catch (error) {
        console.error(error);
        return { error: "Failed to get reviews"};
    }
}

export async function getReviewById(id: number) {
    try {
        const review = await db.select().from(reviewsTable).where(eq(reviewsTable.id, id)).limit(1);
        return review[0] || null;
    } catch (error) {
        console.error(error);
        return { error: "Failed to get review"};
    }
}

export async function createReview(review: Omit<Review, 'id' | 'createdAt'>) {
    try {
        await db.insert(reviewsTable).values(review);
    } catch (error) {
        console.error(error);
        return { error: "Failed to create review"};
    }
}

export async function updateReview(review: Omit<Review, 'createdAt'>) {
    try {
        await db.update(reviewsTable).set(review).where(eq(reviewsTable.id, review.id));
    } catch (error) {
        console.error(error);
        return { error: "Failed to update review"};
    }
}

export async function deleteReview(id: number) {
    try {
        await db.delete(reviewsTable).where(eq(reviewsTable.id, id));
        return { message: "Review deleted successfully" };
    } catch (error) {
        console.error(error);
        return { error: "Failed to delete review"};
    }
}