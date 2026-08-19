/**
 * Seed the database with initial data using raw SQL
 */
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "powerhouse.db");
const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  sqlite.exec("DELETE FROM recommendations");
  sqlite.exec("DELETE FROM weekly_scores");
  sqlite.exec("DELETE FROM daily_logs");
  sqlite.exec("DELETE FROM tasks");
  sqlite.exec("DELETE FROM focus_areas");
  sqlite.exec("DELETE FROM settings");

  // ── Focus Areas ──────────────────────────────────
  sqlite
    .prepare(
      "INSERT INTO focus_areas (slug, name, color, emoji, sort_order) VALUES (?, ?, ?, ?, ?)"
    )
    .run("powerhouse", "POWERHOUSE", "#F59E0B", "⚡", 0);

  sqlite
    .prepare(
      "INSERT INTO focus_areas (slug, name, color, emoji, sort_order) VALUES (?, ?, ?, ?, ?)"
    )
    .run("personal", "PERSONAL", "#10B981", "🧑", 1);

  // Get IDs
  const rows = sqlite
    .prepare("SELECT id, slug FROM focus_areas ORDER BY sort_order")
    .all() as { id: number; slug: string }[];

  const powerhouse = rows.find((r) => r.slug === "powerhouse");
  const personal = rows.find((r) => r.slug === "personal");

  if (!powerhouse || !personal) {
    console.error("Focus area rows:", rows);
    throw new Error("Failed to create focus areas");
  }

  console.log(`  Powerhouse ID: ${powerhouse.id}, Personal ID: ${personal.id}`);

  // ── Powerhouse Tasks ─────────────────────────────
  sqlite
    .prepare(
      "INSERT INTO tasks (focus_area_id, code, title, description, target, sort_order) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(powerhouse.id, "a", "LeadersLAB", "Select and train new leaders — invest in a future leader today", null, 0);

  sqlite
    .prepare(
      "INSERT INTO tasks (focus_area_id, code, title, description, target, sort_order) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(powerhouse.id, "b", "Powerhouse Academy", "Plan, organize, setup & launch — move it forward", "Launch 2026", 1);

  sqlite
    .prepare(
      "INSERT INTO tasks (focus_area_id, code, title, description, target, sort_order) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(powerhouse.id, "c", "Discipleship + Demonstration", "Intentional one-on-one discipleship with practical demonstration", null, 2);

  // ── Personal Tasks ───────────────────────────────
  sqlite
    .prepare(
      "INSERT INTO tasks (focus_area_id, code, title, description, target, target_date, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .run(personal.id, "d", "Read 1hr + Write 1 Chapter", "Daily reading + writing. Finish 2 books by 30 Nov 2026", "30 Nov 2026", "2026-11-30", 0);

  sqlite
    .prepare(
      "INSERT INTO tasks (focus_area_id, code, title, description, target, sort_order) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(personal.id, "e", "Exercise 1.5hr", "Physical training 4-5 days per week", null, 1);

  // ── Settings ─────────────────────────────────────
  const now = new Date().toISOString();
  sqlite.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("goal_books", "2");
  sqlite.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("book_deadline", "2026-11-30");
  sqlite.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("exercise_target_days", "5");
  sqlite.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("exercise_duration_min", "90");
  sqlite.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("reading_daily_min", "60");
  sqlite.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("created_at", now);

  console.log("✅ Seeded successfully!");
  console.log("  • 2 focus areas (Powerhouse + Personal)");
  console.log("  • 5 tasks (a, b, c, d, e)");
  console.log("  • Settings configured");

  sqlite.close();
}

seed();
