import { NextResponse } from "next/server";
import { getToday, getWeekStart, getWeekEnd, daysUntil } from "@/lib/utils";
import { getWeekProgress, getMonthProgress, getStreak, getActiveTasks } from "@/lib/db/queries";

export async function GET() {
  try {
    const today = getToday();
    const weekStart = getWeekStart();
    const weekEnd = getWeekEnd();

    const week = await getWeekProgress(weekStart, weekEnd);
    const month = await getMonthProgress(
      new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0],
      today
    );

    const allTasks = (await getActiveTasks()) as any[];
    const streak = await getStreak(allTasks.length);

    return NextResponse.json({
      week,
      month,
      streak,
      bookDeadline: { date: "2026-11-30", daysLeft: daysUntil("2026-11-30") },
      today,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}
