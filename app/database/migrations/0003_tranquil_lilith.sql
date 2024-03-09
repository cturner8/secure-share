CREATE TABLE IF NOT EXISTS "user_authenticator" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid,
	"credential_id" text NOT NULL,
	"credential_public_key" "bytea" NOT NULL,
	"counter" bigint NOT NULL,
	"credential_device_type" varchar(32) NOT NULL,
	"credential_backed_up" boolean NOT NULL,
	"transports" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"email_hash" text NOT NULL,
	"email" json NOT NULL,
	"current_auth_challenge" text NOT NULL,
	CONSTRAINT "user_profile_email_hash_unique" UNIQUE("email_hash")
);
--> statement-breakpoint
DROP INDEX IF EXISTS "email_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "credential_idx" ON "user_authenticator" ("credential_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_profile_email_idx" ON "user_profile" ("email_hash");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_registration_email_idx" ON "user_registration" ("email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_authenticator" ADD CONSTRAINT "user_authenticator_user_id_user_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "user_profile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
