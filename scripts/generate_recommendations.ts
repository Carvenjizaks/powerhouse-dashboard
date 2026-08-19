/**
 * Smart Recommendation Generator
 * Run via cron: 0 22 * * *
 * Analyzes weekly data and generates recommendations
 */

import { db } from "../lib/db";
import { recommendations, dailyLogs, tasks, focusAreas } from "../lib/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";

async function generate() {
  console.log(`[${new Date().toISOString()}] Generating recommendations...`);

  const today = new Date().toISOString().split("T")[0];
  const weekStart = getWeekStart();

  // Delete old recommendations for today
  db.delete(recommendations).where(eq(recommendations.date, today)).run();

  const newRecs: Array<{
    date: string;
    text: string;
    type: string;
    category: string;
    priority: number;
  }> = [];

  // Get this week's logs
  const weekLogs = db
    .select({
      taskId: dailyLogs.taskId,
      completed: dailyLogs.completed,
      date: dailyLogs.date,
    })
    .from(dailyLogs)
    .where(
      and(gte(dailyLogs.date, weekStart), lte(dailyLogs.date, today))
    )
    .all();

  // Get all tasks
  const allTasks = db
    .select({
      id: tasks.id,
      code: tasks.code,
      title: tasks.title,
      focusAreaSlug: focusAreas.slug,
    })
    .from(tasks)
    .innerJoin(focusAreas, eq(tasks.focusAreaId, focusAreas.id))
    .where(eq(tasks.isActive, 1))
    .all();

  // Powerhouse check
  const phTasks = allTasks.filter((t) => t.focusAreaSlug === "powerhouse");
  const phDone = weekLogs.filter(
    (l) => phTasks.some((t) => t.id === l.taskId) && l.completed === 1
  ).length;
  const phExpected = phTasks.length * 7;
  const phRatio = phExpected > 0 ? phDone / phExpected : 0;

  if (phRatio < 0.3) {
    newRecs.push({
      date: today,
      text: "Powerhouse tasks are low this week. Block 2 hours tomorrow for Kingdom work.",
      type: "warning",
      category: "powerhouse",
      priority: 3,
    });
  } else if (phRatio > 0.7) {
    newRecs.push({
      date: today,
      text: "🔥 Strong Powerhouse week! You're building momentum in the Kingdom.",
      type: "encouragement",
      category: "powerhouse",
      priority: 2,
    });
  }

  // Reading check
  const readingTask = allTasks.find((t) => t.code === "d");
  if (readingTask) {
    const rd = weekLogs.filter(
      (l) => l.taskId === readingTask.id && l.completed === 1
    ).length;
    if (rd < 4) {
      newRecs.push({
        date: today,
        text: `Reading/Writing: ${rd}/7 days this week. One chapter a day keeps the deadline at bay.`,
        type: "tip",
        category: "personal",
        priority: 2,
      });
    }
  }

  // Exercise check
  const exTask = allTasks.find((t) => t.code === "e");
  if (exTask) {
    const ex = weekLogs.filter(
      (l) => l.taskId === exTask.id && l.completed === 1
    ).length;
    if (ex < 2) {
      newRecs.push({
        date: today,
        text: `Exercise: only ${ex}x this week. Your body is your vessel — steward it.`,
        type: "warning",
        category: "personal",
        priority: 2,
      });
    }
  }

  // Streak check
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split("T")[0];
    const dayLogs = weekLogs.filter((l) => l.date === ds && l.completed === 1);
    if (dayLogs.length === allTasks.length) streak++;
    else if (i > 0) break;
  }

  if (streak >= 3) {
    newRecs.push({
      date: today,
      text: `🔥 ${streak}-day streak! Don't break the chain.`,
      type: "encouragement",
      category: "general",
      priority: 3,
    });
  }

  // Default insight
  newRecs.push({
    date: today,
    text: "Small daily disciplines compound into extraordinary results. Stay locked.",
    type: "insight",
    category: "general",
    priority: 1,
  });

  // Save
  for (const rec of newRecs) {
    db.insert(recommendations).values(rec).run();
  }

  console.log(`✅ Generated ${newRecs.length} recommendations for ${today}`);
}

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split("T")[0];
}

generate().catch(console.error);
