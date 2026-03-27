CREATE TABLE "messages_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_id" integer NOT NULL,
	"receiver_id" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "messages_table" ADD CONSTRAINT "messages_table_sender_id_users_table_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "messages_table" ADD CONSTRAINT "messages_table_receiver_id_users_table_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;
