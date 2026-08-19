/**
 * Universal database adapter — works everywhere
 * - Postgres when DATABASE_URL is set
 * - SQLite via @libsql/client otherwise (local & Vercel)
 */

import { createClient } from "@libsql/client";

const isVercel = !!process.env.VERCEL;
const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL || "";

let _db: any = null;

async function getDb() {
  if (_db) return _db;

  if (DATABASE_URL) {
    // Postgres via Neon
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(DATABASE_URL);
    _db = {
      query: async (text: string, params?: any[]) => {
        const result: any = await sql.query(text, params || []);
        return result.rows || result;
      },
      close: async () => {},
    };
    return _db;
  }

  // SQLite via libSQL (pure JS, works everywhere)
  const dbUrl = isVercel ? "file:/tmp/powerhouse.db" : "file:data/powerhouse.db";
  const client = createClient({ url: dbUrl });

  _db = {
    query: async (text: string, params?: any[]) => {
      if (params && params.length > 0) {
        const result = await client.execute({ sql: text, args: params });
        return result.rows;
      }
      const result = await client.execute(text);
      if (text.trim().toUpperCase().startsWith("SELECT")) {
        return result.rows;
      }
      return result;
    },
    close: async () => { client.close(); },
  };

  return _db;
}

export async function query(text: string, params?: any[]) {
  const db = await getDb();
  return db.query(text, params);
}

export async function queryOne(text: string, params?: any[]) {
  const rows = await query(text, params);
  if (rows && typeof rows === 'object' && Symbol.iterator in Object(rows)) {
    const arr = Array.from(rows as any);
    return arr[0];
  }
  return null;
}

export async function execute(text: string, params?: any[]) {
  const db = await getDb();
  return db.query(text, params);
}

export { isVercel };

// ── Auto-seed ──────────────────────────────────────────
export async function ensureSeeded() {
  if (DATABASE_URL) return;

  const db = await getDb();
  try {
    // @ts-ignore
    const tables = Array.from(await db.query("SELECT name FROM sqlite_master WHERE type='table' AND name='focus_areas'") || []);
    if (tables.length > 0) {
      // Check if old slug exists and migrate
      const oldPH = Array.from(await db.query("SELECT id FROM focus_areas WHERE slug = 'powerhouse'") || []);
      if (oldPH.length > 0) {
        await db.query("UPDATE focus_areas SET slug = 'kingdom-building', name = 'KINGDOM BUILDING', emoji = '👑' WHERE slug = 'powerhouse'");
      }
      const newPH = Array.from(await db.query("SELECT id, slug FROM focus_areas WHERE slug = 'kingdom-building'") || []);
      if (newPH.length > 0) return; // Already migrated
    }

    await db.query("CREATE TABLE IF NOT EXISTS focus_areas (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, color TEXT NOT NULL, emoji TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0)");
    await db.query("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, focus_area_id INTEGER NOT NULL, code TEXT NOT NULL, title TEXT NOT NULL, description TEXT, target TEXT, target_date TEXT, sort_order INTEGER NOT NULL DEFAULT 0, is_active INTEGER NOT NULL DEFAULT 1)");
    await db.query("CREATE TABLE IF NOT EXISTS daily_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, task_id INTEGER NOT NULL, date TEXT NOT NULL, completed INTEGER NOT NULL DEFAULT 0, notes TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now')))");
    await db.query("CREATE TABLE IF NOT EXISTS weekly_scores (id INTEGER PRIMARY KEY AUTOINCREMENT, week_start TEXT NOT NULL, week_end TEXT NOT NULL, powerhouse_score REAL NOT NULL DEFAULT 0, personal_score REAL NOT NULL DEFAULT 0, overall_score REAL NOT NULL DEFAULT 0, streak INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT (datetime('now')))");
    await db.query("CREATE TABLE IF NOT EXISTS recommendations (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, text TEXT NOT NULL, type TEXT NOT NULL DEFAULT 'tip', category TEXT, priority INTEGER NOT NULL DEFAULT 0, is_read INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT (datetime('now')))");
    await db.query("CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT NOT NULL UNIQUE, value TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT (datetime('now')))");

    await db.query("INSERT INTO focus_areas (slug, name, color, emoji, sort_order) VALUES ('kingdom-building', 'KINGDOM BUILDING', '#F59E0B', '👑', 0)");
    await db.query("INSERT INTO focus_areas (slug, name, color, emoji, sort_order) VALUES ('personal', 'PERSONAL', '#10B981', '🧑', 1)");
    
    const rows2: any = Array.from(await db.query("SELECT id, slug FROM focus_areas ORDER BY sort_order") || []);
    const ph = rows2.find((r: any) => r.slug === "kingdom-building");
    const pe = rows2.find((r: any) => r.slug === "personal");

    if (ph && pe) {
      await db.query("INSERT INTO tasks (focus_area_id, code, title, description, sort_order) VALUES (?, 'a', 'LeadersLAB', 'Select and train new leaders', 0)", [ph.id]);
      await db.query("INSERT INTO tasks (focus_area_id, code, title, description, target, sort_order) VALUES (?, 'b', 'Powerhouse Academy', 'Plan, organize, setup & launch', 'Launch 2026', 1)", [ph.id]);
      await db.query("INSERT INTO tasks (focus_area_id, code, title, description, sort_order) VALUES (?, 'c', 'Discipleship + Demonstration', 'Intentional one-on-one discipleship with practical demonstration', 2)", [ph.id]);
      await db.query("INSERT INTO tasks (focus_area_id, code, title, description, target, target_date, sort_order) VALUES (?, 'd', 'Read 1hr + Write 1 Chapter', 'Daily reading + writing. Finish 2 books by 30 Nov 2026', '30 Nov 2026', '2026-11-30', 0)", [pe.id]);
      await db.query("INSERT INTO tasks (focus_area_id, code, title, description, sort_order) VALUES (?, 'e', 'Exercise 1.5hr', 'Physical training 4-5 days per week', 1)", [pe.id]);
      await db.query("INSERT INTO settings (key, value) VALUES ('goal_books', '2')");
      await db.query("INSERT INTO settings (key, value) VALUES ('book_deadline', '2026-11-30')");
    }
  } catch (e) {
    console.error("Auto-seed error:", e);
  }
}