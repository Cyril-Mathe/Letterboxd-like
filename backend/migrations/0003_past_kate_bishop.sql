CREATE TABLE "follows_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"follower_id" integer NOT NULL,
	"followed_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reviews_table" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews_table" ADD COLUMN "imdb_id" text;--> statement-breakpoint
ALTER TABLE "follows_table" ADD CONSTRAINT "follows_table_follower_id_users_table_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows_table" ADD CONSTRAINT "follows_table_followed_id_users_table_id_fk" FOREIGN KEY ("followed_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;