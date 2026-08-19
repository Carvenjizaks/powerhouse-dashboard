import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ── Focus Areas (Powerhouse vs Personal) ────────────────
export const focusAreas = sqliteTable("focus_areas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(), // 'powerhouse' | 'personal'
  name: text("name").notNull(),
  color: text("color").notNull(), // hex color
  emoji: text("emoji").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ── Tasks (the 5 items a-e) ─────────────────────────────
export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  focusAreaId: integer("focus_area_id")
    .notNull()
    .references(() => focusAreas.id),
  code: text("code").notNull(), // 'a', 'b', 'c', 'd', 'e'
  title: text("title").notNull(),
  description: text("description"),
  target: text("target"), // e.g., '30 Nov 2026'
  targetDate: text("target_date"), // ISO date if applicable
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active").notNull().default(1),
});

// ── Daily Logs (check-in data per task per day) ─────────
export const dailyLogs = sqliteTable("daily_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  taskId: integer("task_id")
    .notNull()
    .references(() => tasks.id),
  date: text("date").notNull(), // YYYY-MM-DD
  completed: integer("completed").notNull().default(0), // 0 or 1
  notes: text("notes"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ── Weekly Scores ────────────────────────────────────────
export const weeklyScores = sqliteTable("weekly_scores", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  weekStart: text("week_start").notNull(), // ISO date of Monday
  weekEnd: text("week_end").notNull(), // ISO date of Sunday
  powerhouseScore: real("powerhouse_score").notNull().default(0), // 0-100
  personalScore: real("personal_score").notNull().default(0), // 0-100
  overallScore: real("overall_score").notNull().default(0), // 0-100
  streak: integer("streak").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ── Recommendations (smart tips) ─────────────────────────
export const recommendations = sqliteTable("recommendations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(), // YYYY-MM-DD
  text: text("text").notNull(),
  type: text("type").notNull().default("tip"), // 'tip' | 'warning' | 'insight' | 'encouragement'
  category: text("category"), // 'powerhouse' | 'personal' | 'general'
  priority: integer("priority").notNull().default(0),
  isRead: integer("is_read").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ── Settings ──────��──────────────────────────────────────
export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});
