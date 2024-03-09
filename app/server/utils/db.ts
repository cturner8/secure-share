import { drizzle } from "drizzle-orm/node-postgres";
import fs from "node:fs";
import pg from "pg";

import * as schema from "@/database/tables";

// const event = useRequestEvent();
const { dbHost, dbName, dbUser, dbPasswordFile } = useRuntimeConfig();
const dbPassword = fs.readFileSync(dbPasswordFile, "utf8");

const pool = new pg.Pool({
  host: dbHost,
  port: 5432,
  user: dbUser,
  password: dbPassword,
  database: dbName,
});

export const db = drizzle(pool, { schema });
