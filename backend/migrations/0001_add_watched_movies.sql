CREATE TABLE "watched_movies_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"imdb_id" text NOT NULL,
	"title" text NOT NULL,
	"poster_url" varchar(255),
	"watched_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "watched_movies_table" ADD CONSTRAINT "watched_movies_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;
