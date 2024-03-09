import { relations } from "drizzle-orm";
import {
  json,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { userAuthenticator } from "./userAuthenticator";

export const userProfile = pgTable(
  "user_profile",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    emailHash: text("email_hash").notNull().unique(),
    email: json("email").notNull(),
    currentAuthChallenge: text("current_auth_challenge"),
  },
  (table) => ({
    emailHashIdx: uniqueIndex(`user_profile_email_idx`).on(table.emailHash),
  }),
);

export const userProfileRelations = relations(userProfile, ({ many }) => ({
  authenticators: many(userAuthenticator),
}));
