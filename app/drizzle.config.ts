import "dotenv/config";
import type { Config } from "drizzle-kit";
import fs from "node:fs";

const { NUXT_DB_HOST, NUXT_DB_USER, NUXT_DB_PASSWORD_FILE, NUXT_DB_NAME } =
  process.env;
const DB_PASSWORD = fs.readFileSync(NUXT_DB_PASSWORD_FILE, "utf8");

export default {
  schema: "./database/schema/*.ts",
  out: "./database/migrations",
  driver: "pg",
  dbCredentials: {
    host: NUXT_DB_HOST,
    user: NUXT_DB_USER,
    password: DB_PASSWORD,
    database: NUXT_DB_NAME,
  },
} satisfies Config;
