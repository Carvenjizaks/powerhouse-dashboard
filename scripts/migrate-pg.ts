/**
 * PostgreSQL migration script using pg library
 * Usage: DATABASE_URL=postgres://... npx tsx scripts/migrate-pg.ts
 */

import { Client } from "pg";

async function migrate() {
  const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;
  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable required");
    process.exit(1);
  }

  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  console.log("🌱 Running PostgreSQL migration...");

  await client.query(`CREATE TABLE IF NOT EXISTS focus_areas (
    id SERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    emoji TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  )`);

  await client.query(`CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    focus_area_id INTEGER NOT NULL REFERENCES focus_areas(id),
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    target TEXT,
    target_date TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1
  )`);

  await client.query(`CREATE TABLE IF NOT EXISTS daily_logs (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES tasks(id),
    date TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`);

  await client.query(`CREATE TABLE IF NOT EXISTS weekly_scores (
    id SERIAL PRIMARY KEY,
    week_start TEXT NOT NULL,
    week_end TEXT NOT NULL,
    powerhouse_score REAL NOT NULL DEFAULT 0,
    personal_score REAL NOT NULL DEFAULT 0,
    overall_score REAL NOT NULL DEFAULT 0,
    streak INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
  )`);

  await client.query(`CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    date TEXT NOT NULL,
    text TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'tip',
    category TEXT,
    priority INTEGER NOT NULL DEFAULT 0,
    is_read INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
  )`);

  await client.query(`CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
  )`);

  await client.query(`CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON daily_logs(date)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_daily_logs_task_date ON daily_logs(task_id, date)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_recommendations_date ON recommendations(date)`);

  console.log("✅ All tables created successfully");
  await client.end();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});