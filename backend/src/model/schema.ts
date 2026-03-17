import { integer, pgTable, serial, text, timestamp, varchar, numeric, check } from 'drizzle-orm/pg-core';
import { sql } from "drizzle-orm";

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  username: text('username').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  biographie: text('biographie'),
  avatar_url: varchar('avatar_url', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const moviesTable = pgTable('movies_table', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  year: integer('year'),
  director: text('director'),
  actors: text('actors'), // This can be a comma-separated list of actors
  category: text('category'),
  synopsis: text('synopsis'),
  poster_url: varchar('poster_url', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export const reviewsTable = pgTable("reviews_table", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id),
  movieId: integer("movie_id").references(() => moviesTable.id),
  rating: numeric("rating", { precision: 2, scale: 1 }).notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      ratingCheck: check(
        "rating_check",
        sql`${table.rating} >= 1 AND ${table.rating} <= 5`
      ),
    };
  }
);

export const watchedMoviesTable = pgTable('watched_movies_table', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => usersTable.id),
  imdbID: text('imdb_id').notNull(),
  title: text('title').notNull(),
  poster_url: varchar('poster_url', { length: 255 }),
  watchedAt: timestamp('watched_at').notNull().defaultNow(),
});

export type User = typeof usersTable.$inferSelect;

export type Movie = typeof moviesTable.$inferSelect;

export type Review = typeof reviewsTable.$inferSelect;

export type WatchedMovie = typeof watchedMoviesTable.$inferSelect;