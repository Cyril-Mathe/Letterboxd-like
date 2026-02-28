import { db } from "../../db"
import { moviesTable } from "../../model/schema"
import { eq } from "drizzle-orm"
import { Movie } from "../../model/schema"

export async function getMovies() {
    try {
        const movies = await db.select().from(moviesTable);
        return movies;
    } catch (error) {
        console.error(error);
        return { error: "Failed to get movies"};
    }
}

export async function getMovieById(id: number) {
    try {
        const movie = await db.select().from(moviesTable).where(eq(moviesTable.id, id)).limit(1);
        return movie[0] || null;
    } catch (error) {
        console.error(error);
        return { error: "Failed to get movie"};
    }
}

export async function createMovie(movie: Omit<Movie, 'id' | 'createdAt'>) {
    try {
        await db.insert(moviesTable).values(movie);
    } catch (error) {
        console.error(error);
        return { error: "Failed to create movie"};
    }
}

export async function updateMovie(movie: Omit<Movie, 'createdAt'>) {
    try {
        await db.update(moviesTable).set(movie).where(eq(moviesTable.id, movie.id));
    } catch (error) {
        console.error(error);
        return { error: "Failed to update movie"};
    }
}

export async function deleteMovie(id: number) {
    try {
        await db.delete(moviesTable).where(eq(moviesTable.id, id));
        return { message: "Movie deleted successfully" };
    } catch (error) {
        console.error(error);
        return { error: "Failed to delete movie"};
    }
}