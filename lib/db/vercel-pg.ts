/**
 * Database adapter — works with both Vercel (Postgres or libSQL) and local dev
 *
 * On Vercel:
 *   - If DATABASE_URL is set → uses Postgres (Neon/neon)
 *   - If not → uses libSQL (WASM SQLite, works in serverless)
 *
 * Local dev:
 *   - Uses better-sqlite3 (fast native SQLite)
 */

// ── Detect environment ─────────────────────────────────
const isVercel = !!process.env.VERCEL;
const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL || "";

// ── Query function ─────────────────────────────────────
let _db: any = null;

async function getDb() {
  if (_db) return _db;

  if (DATABASE_URL) {
    // Use Postgres via Neon
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(DATABASE_URL);
    _db = {
      query: async (text: string, params?: any[]) => {
        try {
          if (params && params.length > 0) {
            return await sql.query(text, params);
          }
          return await sql(text);
        } catch (err: any) {
          // Fallback: try tagged template
          if (err.message?.includes("tagged-template")) {
            return await sql.query(text, params || []);
          }
          throw err;
        }
      },
      close: async () => {},
    };
    return _db;
  }

  if (isVercel) {
    // Use libSQL (WASM SQLite) on Vercel
    const { createClient } = await import("@libsql/client");
    const client = createClient({
      url: "file:/tmp/powerhouse.db",
    });
    _db = {
      query: async (text: string, params?: any[]) => {
        if (params && params.length > 0) {
          const stmt = await client.execute({ sql: text, args: params });
          return stmt.rows;
        }
        const stmt = await client.execute(text);
        // For CREATE/INSERT/UPDATE/DELETE, return result
        if (text.trim().toUpperCase().startsWith("SELECT")) {
          return stmt.rows;
        }
        return stmt;
      },
      close: async () => {},
    };
    return _db;
  }

  // Local dev: use better-sqlite3
  const Database = (await import("better-sqlite3")).default;
  const path = await import("path");
  const fs = await import("fs");
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const dbPath = path.join(dataDir, "powerhouse.db");
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  _db = {
    query: (text: string, params?: any[]) => {
      if (params && params.length > 0) {
        const stmt = db.prepare(text);
        return stmt.all(...params);
      }
      return db.exec(text);
    },
    close: () => db.close(),
  };
  return _db;
}

export async function query(text: string, params?: any[]) {
  const db = await getDb();
  return db.query(text, params);
}

export async function queryOne(text: string, params?: any[]) {
  const rows = await query(text, params);
  if (Array.isArray(rows)) return rows[0];
  if (rows && rows.rows) return rows.rows[0];
  return null;
}

export async function execute(text: string, params?: any[]) {
  const db = await getDb();
  return db.query(text, params);
}

export { isVercel };

// ── Seed on first use (if tables are empty) ────────────
export async function ensureSeeded() {
  if (DATABASE_URL) return; // Postgres handles this separately

  const db = await getDb();
  try {
    // Check if tables exist
    const tables = await db.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='focus_areas'"
    );
    const rows = Array.isArray(tables) ? tables : [];
    if (rows.length === 0) {
      // Auto-seed
      await db.query(`CREATE TABLE IF NOT EXISTS focus_areas (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, color TEXT NOT NULL, emoji TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0)`);
      await db.query(`CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, focus_area_id INTEGER NOT NULL, code TEXT NOT NULL, title TEXT NOT NULL, description TEXT, target TEXT, target_date TEXT, sort_order INTEGER NOT NULL DEFAULT 0, is_active INTEGER NOT NULL DEFAULT 1)`);
      await db.query(`CREATE TABLE IF NOT EXISTS daily_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, task_id INTEGER NOT NULL, date TEXT NOT NULL, completed INTEGER NOT NULL DEFAULT 0, notes TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now')))`);
      await db.query(`CREATE TABLE IF NOT EXISTS weekly_scores (id INTEGER PRIMARY KEY AUTOINCREMENT, week_start TEXT NOT NULL, week_end TEXT NOT NULL, powerhouse_score REAL NOT NULL DEFAULT 0, personal_score REAL NOT NULL DEFAULT 0, overall_score REAL NOT NULL DEFAULT 0, streak INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT (datetime('now')))`);
      await db.query(`CREATE TABLE IF NOT EXISTS recommendations (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, text TEXT NOT NULL, type TEXT NOT NULL DEFAULT 'tip', category TEXT, priority INTEGER NOT NULL DEFAULT 0, is_read INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT (datetime('now')))`);
      await db.query(`CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT NOT NULL UNIQUE, value TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT (datetime('now')))`);

      // Seed
      await db.query("INSERT INTO focus_areas (slug, name, color, emoji, sort_order) VALUES ('powerhouse', 'POWERHOUSE', '#F59E0B', '⚡', 0)");
      await db.query("INSERT INTO focus_areas (slug, name, color, emoji, sort_order) VALUES ('personal', 'PERSONAL', '#10B981', '🧑', 1)");
      const rows2: any = await db.query("SELECT id, slug FROM focus_areas ORDER BY sort_order");
      const ph = rows2.find((r: any) => r.slug === "powerhouse");
      const pe = rows2.find((r: any) => r.slug === "personal");

      if (ph && pe) {
        await db.query("INSERT INTO tasks (focus_area_id, code, title, description, sort_order) VALUES ($1, 'a', 'LeadersLAB', 'Select and train new leaders', 0)", [ph.id]);
        await db.query("INSERT INTO tasks (focus_area_id, code, title, description, target, sort_order) VALUES ($1, 'b', 'Powerhouse Academy', 'Plan, organize, setup & launch', 'Launch 2026', 1)", [ph.id]);
        await db.query("INSERT INTO tasks (focus_area_id, code, title, description, sort_order) VALUES ($1, 'c', 'Discipleship + Demonstration', 'Intentional one-on-one discipleship with practical demonstration', 2)", [ph.id]);
        await db.query("INSERT INTO tasks (focus_area_id, code, title, description, target, target_date, sort_order) VALUES ($1, 'd', 'Read 1hr + Write 1 Chapter', 'Daily reading + writing. Finish 2 books by 30 Nov 2026', '30 Nov 2026', '2026-11-30', 0)", [pe.id]);
        await db.query("INSERT INTO tasks (focus_area_id, code, title, description, sort_order) VALUES ($1, 'e', 'Exercise 1.5hr', 'Physical training 4-5 days per week', 1)", [pe.id]);
        await db.query("INSERT INTO settings (key, value) VALUES ('goal_books', '2')");
        await db.query("INSERT INTO settings (key, value) VALUES ('book_deadline', '2026-11-30')");
      }
    }
  } catch (e) {
    console.error("Auto-seed error:", e);
  }
}