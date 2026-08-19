/**
 * Vercel Postgres adapter — used by the Next.js API routes on Vercel
 * Falls back to SQLite for local development
 */

import { neon } from "@neondatabase/serverless";

// Detect if we're running on Vercel
const isVercel = !!process.env.VERCEL;

// Get the database URL from environment
const DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.NEON_DATABASE_URL;

let sql: any;

if (isVercel && DATABASE_URL) {
  // Use Neon/Postgres on Vercel
  sql = neon(DATABASE_URL);
} else {
  // Fallback: use SQLite for local dev
  // Will be imported dynamically
}

export async function query(text: string, params?: any[]) {
  if (sql) {
    // Postgres mode
    if (params && params.length > 0) {
      return await sql(text, ...params);
    }
    return await sql(text);
  }

  // SQLite fallback for local dev
  const { default: Database } = await import("better-sqlite3");
  const path = await import("path");
  const fs = await import("fs");

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const dbPath = path.join(dataDir, "powerhouse.db");
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  try {
    if (params && params.length > 0) {
      const stmt = db.prepare(text);
      return stmt.all(...params);
    }
    return db.exec(text);
  } finally {
    db.close();
  }
}

export async function queryOne(text: string, params?: any[]) {
  const rows = await query(text, params);
  if (Array.isArray(rows)) return rows[0];
  return null;
}

export async function execute(text: string, params?: any[]) {
  if (sql) {
    if (params && params.length > 0) {
      return await sql(text, ...params);
    }
    return await sql(text);
  }

  const { default: Database } = await import("better-sqlite3");
  const path = await import("path");
  const fs = await import("fs");

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const dbPath = path.join(dataDir, "powerhouse.db");
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  try {
    if (params && params.length > 0) {
      const stmt = db.prepare(text);
      return stmt.run(...params);
    }
    return db.exec(text);
  } finally {
    db.close();
  }
}

export { isVercel };