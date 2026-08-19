import { NextResponse } from "next/server";
import { toggleDailyLog, getLogsRange } from "@/lib/db/queries";
import { getToday } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { taskId, completed, date } = await request.json();
    if (!taskId) return NextResponse.json({ error: "taskId is required" }, { status: 400 });
    const data = await toggleDailyLog(taskId, completed, date || getToday());
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating daily log:", error);
    return NextResponse.json({ error: "Failed to update daily log" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start") || getToday();
    const end = searchParams.get("end") || getToday();
    const logs = await getLogsRange(start, end);
    return NextResponse.json({ logs, startDate: start, endDate: end });
  } catch (error) {
    console.error("Error fetching daily logs:", error);
    return NextResponse.json({ error: "Failed to fetch daily logs" }, { status: 500 });
  }
}
