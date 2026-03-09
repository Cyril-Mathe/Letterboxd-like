CREATE TABLE "movies_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"year" integer,
	"director" text,
	"actors" text,
	"category" text,
	"synopsis" text,
	"poster_url" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"movie_id" integer,
	"rating" numeric(2, 1) NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rating_check" CHECK ("reviews_table"."rating" >= 1 AND "reviews_table"."rating" <= 5)
);
--> statement-breakpoint
CREATE TABLE "users_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"biographie" text,
	"avatar_url" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_table_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "reviews_table" ADD CONSTRAINT "reviews_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews_table" ADD CONSTRAINT "reviews_table_movie_id_movies_table_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies_table"("id") ON DELETE no action ON UPDATE no action;