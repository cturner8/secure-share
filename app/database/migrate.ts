import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import fs from "node:fs";
import { Client } from "pg";

const { NUXT_DB_HOST, NUXT_DB_USER, NUXT_DB_PASSWORD_FILE, NUXT_DB_NAME } =
  process.env;
const DB_PASSWORD = fs.readFileSync(NUXT_DB_PASSWORD_FILE, "utf8");

const client = new Client({
  host: NUXT_DB_HOST,
  port: 5432,
  user: NUXT_DB_USER,
  password: DB_PASSWORD,
  database: NUXT_DB_NAME,
});

await client.connect();

const db = drizzle(client);

await migrate(db, { migrationsFolder: "database/migrations" });
await client.end();
