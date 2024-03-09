import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { bytea } from "../types/bytea";
import { userProfile } from "./userProfile";

export const userAuthenticator = pgTable(
  "user_authenticator",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    userId: uuid("user_id").notNull(),
    credentialId: text("credential_id").notNull(),
    credentialPublicKey: bytea("credential_public_key").notNull(),
    counter: bigint("counter", { mode: "number" }).notNull(),
    credentialDeviceType: varchar("credential_device_type", {
      length: 32,
    }).notNull(),
    credentialBackedUp: boolean("credential_backed_up").notNull(),
    transports: varchar("transports", { length: 255 }),
  },
  (table) => ({
    credentialIdx: index("credential_idx").on(table.credentialId),
  }),
);

export const userAuthenticatorRelations = relations(
  userAuthenticator,
  ({ one }) => ({
    userProfile: one(userProfile, {
      fields: [userAuthenticator.userId],
      references: [userProfile.id],
    }),
  }),
);
