/**
 * Shared database schema — used by both Vercel (Postgres) and OpenClaw (SQLite)
 */

// PostgreSQL schema (used by Vercel)
export const pgSchema = {
  // Focus Areas
  createFocusAreas: `
    CREATE TABLE IF NOT EXISTS focus_areas (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      emoji TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );
  `,

  // Tasks
  createTasks: `
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      focus_area_id INTEGER NOT NULL REFERENCES focus_areas(id),
      code TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      target TEXT,
      target_date TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1
    );
  `,

  // Daily Logs
  createDailyLogs: `
    CREATE TABLE IF NOT EXISTS daily_logs (
      id SERIAL PRIMARY KEY,
      task_id INTEGER NOT NULL REFERENCES tasks(id),
      date TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `,

  // Weekly Scores
  createWeeklyScores: `
    CREATE TABLE IF NOT EXISTS weekly_scores (
      id SERIAL PRIMARY KEY,
      week_start TEXT NOT NULL,
      week_end TEXT NOT NULL,
      powerhouse_score REAL NOT NULL DEFAULT 0,
      personal_score REAL NOT NULL DEFAULT 0,
      overall_score REAL NOT NULL DEFAULT 0,
      streak INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `,

  // Recommendations
  createRecommendations: `
    CREATE TABLE IF NOT EXISTS recommendations (
      id SERIAL PRIMARY KEY,
      date TEXT NOT NULL,
      text TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'tip',
      category TEXT,
      priority INTEGER NOT NULL DEFAULT 0,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `,

  // Settings
  createSettings: `
    CREATE TABLE IF NOT EXISTS settings (
      id SERIAL PRIMARY KEY,
      key TEXT NOT NULL UNIQUE,
      value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `,

  // Indexes
  createIndexes: `
    CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON daily_logs(date);
    CREATE INDEX IF NOT EXISTS idx_daily_logs_task_date ON daily_logs(task_id, date);
    CREATE INDEX IF NOT EXISTS idx_recommendations_date ON recommendations(date);
  `,
};

// SQLite schema (used by OpenClaw)
export const sqliteSchema = {
  createFocusAreas: `
    CREATE TABLE IF NOT EXISTS focus_areas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      emoji TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );
  `,
  createTasks: `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      focus_area_id INTEGER NOT NULL REFERENCES focus_areas(id),
      code TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      target TEXT,
      target_date TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1
    );
  `,
  createDailyLogs: `
    CREATE TABLE IF NOT EXISTS daily_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER NOT NULL REFERENCES tasks(id),
      date TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `,
  createWeeklyScores: `
    CREATE TABLE IF NOT EXISTS weekly_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      week_start TEXT NOT NULL,
      week_end TEXT NOT NULL,
      powerhouse_score REAL NOT NULL DEFAULT 0,
      personal_score REAL NOT NULL DEFAULT 0,
      overall_score REAL NOT NULL DEFAULT 0,
      streak INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `,
  createRecommendations: `
    CREATE TABLE IF NOT EXISTS recommendations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      text TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'tip',
      category TEXT,
      priority INTEGER NOT NULL DEFAULT 0,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `,
  createSettings: `
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `,
  createIndexes: `
    CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON daily_logs(date);
    CREATE INDEX IF NOT EXISTS idx_daily_logs_task_date ON daily_logs(task_id, date);
    CREATE INDEX IF NOT EXISTS idx_recommendations_date ON recommendations(date);
  `,
};
