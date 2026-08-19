/**
 * Shared database queries — used by both Vercel API routes and OpenClaw scripts
 * These queries are database-agnostic (work with Postgres and SQLite)
 */

import { query, queryOne, execute, ensureSeeded } from "./vercel-pg";

// Auto-seed on first load (for Vercel serverless with libSQL)
ensureSeeded();

// ── Focus Areas ────────────────────────────────────────
export async function getFocusAreas() {
  return query("SELECT * FROM focus_areas ORDER BY sort_order");
}

// ── Tasks ──────────────────────────────────────────────
export async function getActiveTasks() {
  return query(`
    SELECT t.id, t.code, t.title, t.description, t.target, t.target_date,
           t.sort_order, t.focus_area_id,
           f.slug AS focus_area_slug, f.name AS focus_area_name,
           f.color AS focus_area_color, f.emoji AS focus_area_emoji
    FROM tasks t
    JOIN focus_areas f ON t.focus_area_id = f.id
    WHERE t.is_active = 1
    ORDER BY f.sort_order, t.sort_order
  `);
}

export async function getTasksWithStatus(date: string) {
  const allTasks = await getActiveTasks();
  const logs = await query("SELECT * FROM daily_logs WHERE date = $1", [date]);
  const completedMap = new Map<number, boolean>();
  for (const log of logs as any[]) {
    completedMap.set(log.task_id, log.completed === 1);
  }
  const tasks = (allTasks as any[]).map((t: any) => ({
    ...t,
    completed: completedMap.get(t.id) ?? false,
  }));
  const total = tasks.length;
  const done = tasks.filter((t: any) => t.completed).length;
  return {
    tasks,
    stats: { total, completed: done, percentage: total > 0 ? Math.round((done / total) * 100) : 0 },
    date,
  };
}

// ── Daily Logs ─────────────────────────────────────────
export async function toggleDailyLog(taskId: number, completed: boolean, date: string) {
  const existing = await query("SELECT * FROM daily_logs WHERE task_id = $1 AND date = $2", [taskId, date]);
  if ((existing as any[]).length > 0) {
    await execute("UPDATE daily_logs SET completed = ?1, updated_at = datetime('now') WHERE task_id = ?2 AND date = ?3", [
      completed ? 1 : 0,
      taskId,
      date,
    ]);
  } else {
    await execute("INSERT INTO daily_logs (task_id, date, completed) VALUES (?1, ?2, ?3)", [
      taskId,
      date,
      completed ? 1 : 0,
    ]);
  }
  return { success: true, date };
}

export async function getLogsRange(startDate: string, endDate: string) {
  return query("SELECT * FROM daily_logs WHERE date >= $1 AND date <= $2 ORDER BY date", [startDate, endDate]);
}

// ── Progress ───────────────────────────────────────────
export async function getWeekProgress(weekStart: string, weekEnd: string) {
  const logs = await query(
    "SELECT date, task_id, completed FROM daily_logs WHERE date >= $1 AND date <= $2",
    [weekStart, weekEnd]
  );
  const tasks = await query("SELECT id FROM tasks WHERE is_active = 1");
  const totalTasks = (tasks as any[]).length;

  const dailyStats = new Map<string, { total: number; done: number }>();
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    dailyStats.set(d.toISOString().split("T")[0], { total: totalTasks, done: 0 });
  }
  for (const log of logs as any[]) {
    const s = dailyStats.get(log.date);
    if (s && log.completed === 1) s.done += 1;
  }

  return Array.from(dailyStats.entries()).map(([date, stats]) => ({
    date,
    dayName: new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" }),
    ...stats,
    percentage: stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0,
  }));
}

export async function getMonthProgress(startDate: string, endDate: string) {
  const logs = await query("SELECT * FROM daily_logs WHERE date >= $1 AND date <= $2", [startDate, endDate]);
  const logsArr = logs as any[];
  const done = logsArr.filter((l: any) => l.completed === 1).length;
  return { total: logsArr.length, completed: done, percentage: logsArr.length > 0 ? Math.round((done / logsArr.length) * 100) : 0 };
}

export async function getStreak(totalTasks: number) {
  const logs = await query("SELECT date, completed FROM daily_logs ORDER BY date DESC");
  const logsByDate = new Map<string, number>();
  for (const log of logs as any[]) {
    if (log.completed === 1) logsByDate.set(log.date, (logsByDate.get(log.date) || 0) + 1);
  }
  let streak = 0;
  const uniqueDates = Array.from(logsByDate.keys()).sort().reverse();
  for (const dateStr of uniqueDates) {
    if ((logsByDate.get(dateStr) || 0) >= totalTasks) streak++;
    else break;
  }
  return streak;
}

// ── Recommendations ────────────────────────────────────
export async function getTodayRecommendations(date: string) {
  return query("SELECT * FROM recommendations WHERE date = $1 ORDER BY priority DESC", [date]);
}

export async function saveRecommendation(rec: { date: string; text: string; type: string; category: string; priority: number }) {
  await execute(
    "INSERT INTO recommendations (date, text, type, category, priority) VALUES ($1, $2, $3, $4, $5)",
    [rec.date, rec.text, rec.type, rec.category, rec.priority]
  );
}

// ── Settings ───────────────────────────────────────────
export async function getSetting(key: string) {
  const row = await queryOne("SELECT value FROM settings WHERE key = $1", [key]);
  return row ? (row as any).value : null;
}