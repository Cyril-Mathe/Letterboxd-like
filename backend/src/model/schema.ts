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

export const reviewsTable = pgTable("reviews_table", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  imdbID: text("imdb_id"),
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

export const followsTable = pgTable('follows_table', {
  id: serial('id').primaryKey(),
  followerId: integer('follower_id').notNull().references(() => usersTable.id),
  followedId: integer('followed_id').notNull().references(() => usersTable.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const messagesTable = pgTable('messages_table', {
  id: serial('id').primaryKey(),
  senderId: integer('sender_id').notNull().references(() => usersTable.id),
  receiverId: integer('receiver_id').notNull().references(() => usersTable.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type User = typeof usersTable.$inferSelect;

export type Review = typeof reviewsTable.$inferSelect;

export type WatchedMovie = typeof watchedMoviesTable.$inferSelect;

export type Follow = typeof followsTable.$inferSelect;