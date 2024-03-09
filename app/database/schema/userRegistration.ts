import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const userRegistration = pgTable(
  "user_registration",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    email: text("email").notNull().unique(),
    challenge: text("challenge").notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("user_registration_email_idx").on(table.email),
  }),
);
