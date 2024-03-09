ALTER TABLE "user_authenticator" DROP CONSTRAINT "user_authenticator_user_id_user_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "user_authenticator" ALTER COLUMN "credential_public_key" SET DATA TYPE text;