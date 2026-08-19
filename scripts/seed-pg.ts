/**
 * PostgreSQL seed script
 * Run from OpenClaw against the Vercel/Neon Postgres database
 * Usage: DATABASE_URL=postgres://... npx tsx scripts/seed-pg.ts
 */

import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable required");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function seed() {
  console.log("🌱 Seeding PostgreSQL database...");

  // Clear existing data
  await sql("DELETE FROM recommendations");
  await sql("DELETE FROM weekly_scores");
  await sql("DELETE FROM daily_logs");
  await sql("DELETE FROM tasks");
  await sql("DELETE FROM focus_areas");
  await sql("DELETE FROM settings");

  // Focus areas
  await sql("INSERT INTO focus_areas (slug, name, color, emoji, sort_order) VALUES ('powerhouse', 'POWERHOUSE', '#F59E0B', '⚡', 0)");
  await sql("INSERT INTO focus_areas (slug, name, color, emoji, sort_order) VALUES ('personal', 'PERSONAL', '#10B981', '🧑', 1)");

  const rows = await sql("SELECT id, slug FROM focus_areas ORDER BY sort_order");
  const ph = rows.find((r: any) => r.slug === "powerhouse");
  const pe = rows.find((r: any) => r.slug === "personal");

  if (!ph || !pe) throw new Error("Failed to create focus areas");

  console.log(`  Powerhouse ID: ${ph.id}, Personal ID: ${pe.id}`);

  // Powerhouse tasks
  await sql(`INSERT INTO tasks (focus_area_id, code, title, description, sort_order) VALUES ($1, 'a', 'LeadersLAB', 'Select and train new leaders — invest in a future leader today', 0)`, [ph.id]);
  await sql(`INSERT INTO tasks (focus_area_id, code, title, description, target, sort_order) VALUES ($1, 'b', 'Powerhouse Academy', 'Plan, organize, setup & launch — move it forward', 'Launch 2026', 1)`, [ph.id]);
  await sql(`INSERT INTO tasks (focus_area_id, code, title, description, sort_order) VALUES ($1, 'c', 'Discipleship + Demonstration', 'Intentional one-on-one discipleship with practical demonstration', 2)`, [ph.id]);

  // Personal tasks
  await sql(`INSERT INTO tasks (focus_area_id, code, title, description, target, target_date, sort_order) VALUES ($1, 'd', 'Read 1hr + Write 1 Chapter', 'Daily reading + writing. Finish 2 books by 30 Nov 2026', '30 Nov 2026', '2026-11-30', 0)`, [pe.id]);
  await sql(`INSERT INTO tasks (focus_area_id, code, title, description, sort_order) VALUES ($1, 'e', 'Exercise 1.5hr', 'Physical training 4-5 days per week', 1)`, [pe.id]);

  // Settings
  await sql("INSERT INTO settings (key, value) VALUES ('goal_books', '2')");
  await sql("INSERT INTO settings (key, value) VALUES ('book_deadline', '2026-11-30')");
  await sql("INSERT INTO settings (key, value) VALUES ('exercise_target_days', '5')");
  await sql("INSERT INTO settings (key, value) VALUES ('exercise_duration_min', '90')");
  await sql("INSERT INTO settings (key, value) VALUES ('reading_daily_min', '60')");

  console.log("✅ Seeded successfully!");
  console.log("  • 2 focus areas (Powerhouse + Personal)");
  console.log("  • 5 tasks (a, b, c, d, e)");
  console.log("  • Settings configured");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});