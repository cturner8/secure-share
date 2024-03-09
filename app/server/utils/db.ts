import { drizzle } from "drizzle-orm/node-postgres";
import fs from "node:fs";
import { useRequestEvent } from "nuxt/app";
import { Client } from "pg";

import * as schema from "~/database/tables";

const event = useRequestEvent();
const { dbHost, dbName, dbUser, dbPasswordFile } = useRuntimeConfig(event);
const dbPassword = fs.readFileSync(dbPasswordFile, "utf8");

const client = new Client({
  host: dbHost,
  port: 5432,
  user: dbUser,
  password: dbPassword,
  database: dbName,
});

await client.connect();

export const db = drizzle(client, { schema });
