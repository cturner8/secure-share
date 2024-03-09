CREATE TABLE IF NOT EXISTS "user_registration" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"email" text NOT NULL,
	"challenge" text NOT NULL,
	"credential_id" text NOT NULL,
	CONSTRAINT "user_registration_email_unique" UNIQUE("email")
);
