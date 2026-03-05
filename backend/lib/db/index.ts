import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}

// Lazy singleton — safe for SSG (won't crash at build time)
let _db: ReturnType<typeof getDb> | null = null;

export function db() {
  if (!_db) {
    _db = getDb();
  }
  return _db;
}
