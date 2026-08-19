import { NextResponse } from "next/server";
import { getToday, getWeekStart } from "@/lib/utils";
import {
  getTodayRecommendations,
  saveRecommendation,
  getActiveTasks,
  getLogsRange,
  getFocusAreas,
} from "@/lib/db/queries";

export async function GET() {
  try {
    const today = getToday();
    const existing = await getTodayRecommendations(today);

    if ((existing as any[]).length > 0) {
      return NextResponse.json({ recommendations: existing });
    }

    // Auto-generate recommendations
    const weekStart = getWeekStart();
    const weekLogs = (await getLogsRange(weekStart, today)) as any[];
    const allTasks = (await getActiveTasks()) as any[];
    const newRecs: Array<any> = [];

    // Powerhouse check
    const ph = allTasks.filter((t: any) => t.focus_area_slug === "kingdom-building");
    const phDone = weekLogs.filter(
      (l: any) => ph.some((t: any) => t.id === l.task_id) && l.completed === 1
    ).length;
    const phRatio = ph.length * 7 > 0 ? phDone / (ph.length * 7) : 0;

    if (phRatio < 0.3) {
      newRecs.push({ date: today, text: "Your Kingdom Building tasks are lagging this week. Block 2 hours today for Kingdom work.", type: "warning", category: "kingdom-building", priority: 3 });
    } else if (phRatio > 0.7) {
      newRecs.push({ date: today, text: "🔥 Strong Kingdom Building engagement! Keep building Kingdom momentum.", type: "encouragement", category: "kingdom-building", priority: 2 });
    }

    // Reading check
    const reading = allTasks.find((t: any) => t.code === "d");
    if (reading) {
      const rd = weekLogs.filter((l: any) => l.task_id === reading.id && l.completed === 1).length;
      if (rd < 4) newRecs.push({ date: today, text: `Reading/Writing: ${rd}/7 days this week. One chapter a day keeps the deadline at bay.`, type: "tip", category: "personal", priority: 2 });
    }

    // Exercise check
    const exercise = allTasks.find((t: any) => t.code === "e");
    if (exercise) {
      const ex = weekLogs.filter((l: any) => l.task_id === exercise.id && l.completed === 1).length;
      if (ex < 2) newRecs.push({ date: today, text: `Exercise: only ${ex}x this week. Your body is your vessel — steward it well.`, type: "warning", category: "personal", priority: 2 });
    }

    newRecs.push({ date: today, text: "Small daily disciplines compound into extraordinary results. Stay locked.", type: "insight", category: "general", priority: 1 });

    for (const rec of newRecs) await saveRecommendation(rec);

    return NextResponse.json({ recommendations: newRecs });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
