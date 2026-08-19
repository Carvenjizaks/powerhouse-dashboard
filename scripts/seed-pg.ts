/**
 * PostgreSQL seed script using pg library
 * Usage: DATABASE_URL=postgres://... npx tsx scripts/seed-pg.ts
 */

import { Client } from "pg";

async function seed() {
  const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;
  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable required");
    process.exit(1);
  }

  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  console.log("🌱 Seeding PostgreSQL database...");

  // Clear existing data
  await client.query("DELETE FROM recommendations");
  await client.query("DELETE FROM weekly_scores");
  await client.query("DELETE FROM daily_logs");
  await client.query("DELETE FROM tasks");
  await client.query("DELETE FROM focus_areas");
  await client.query("DELETE FROM settings");

  // Focus areas
  await client.query("INSERT INTO focus_areas (slug, name, color, emoji, sort_order) VALUES ('kingdom-building', 'KINGDOM BUILDING', '#F59E0B', '👑', 0)");
  await client.query("INSERT INTO focus_areas (slug, name, color, emoji, sort_order) VALUES ('personal', 'PERSONAL', '#10B981', '🧑', 1)");

  const res = await client.query("SELECT id, slug FROM focus_areas ORDER BY sort_order");
  const ph = res.rows.find((r) => r.slug === "kingdom-building");
  const pe = res.rows.find((r) => r.slug === "personal");

  if (!ph || !pe) throw new Error("Failed to create focus areas");
  console.log(`  Kingdom Building ID: ${ph.id}, Personal ID: ${pe.id}`);

  // Powerhouse tasks
  await client.query("INSERT INTO tasks (focus_area_id, code, title, description, sort_order) VALUES ($1, 'a', 'LeadersLAB', 'Select and train new leaders — invest in a future leader today', 0)", [ph.id]);
  await client.query("INSERT INTO tasks (focus_area_id, code, title, description, target, sort_order) VALUES ($1, 'b', 'Powerhouse Academy', 'Plan, organize, setup & launch — move it forward', 'Launch 2026', 1)", [ph.id]);
  await client.query("INSERT INTO tasks (focus_area_id, code, title, description, sort_order) VALUES ($1, 'c', 'Discipleship + Demonstration', 'Intentional one-on-one discipleship with practical demonstration', 2)", [ph.id]);

  // Personal tasks
  await client.query("INSERT INTO tasks (focus_area_id, code, title, description, target, target_date, sort_order) VALUES ($1, 'd', 'Read 1hr + Write 1 Chapter', 'Daily reading + writing. Finish 2 books by 30 Nov 2026', '30 Nov 2026', '2026-11-30', 0)", [pe.id]);
  await client.query("INSERT INTO tasks (focus_area_id, code, title, description, sort_order) VALUES ($1, 'e', 'Exercise 1.5hr', 'Physical training 4-5 days per week', 1)", [pe.id]);

  // Settings
  await client.query("INSERT INTO settings (key, value) VALUES ('goal_books', '2')");
  await client.query("INSERT INTO settings (key, value) VALUES ('book_deadline', '2026-11-30')");
  await client.query("INSERT INTO settings (key, value) VALUES ('exercise_target_days', '5')");
  await client.query("INSERT INTO settings (key, value) VALUES ('exercise_duration_min', '90')");
  await client.query("INSERT INTO settings (key, value) VALUES ('reading_daily_min', '60')");

  console.log("✅ Seeded successfully!");
  console.log("  • 2 focus areas (Kingdom Building + Personal)");
  console.log("  • 5 tasks (a, b, c, d, e)");
  console.log("  • Settings configured");

  await client.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});