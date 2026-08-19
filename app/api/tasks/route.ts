import { NextResponse } from "next/server";
import { getTasksWithStatus } from "@/lib/db/queries";
import { getToday } from "@/lib/utils";

export async function GET() {
  try {
    const data = await getTasksWithStatus(getToday());
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}
