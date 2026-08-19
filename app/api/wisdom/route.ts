import { NextResponse } from "next/server";
import { getWisdomForDate } from "@/lib/wisdom/data";
import { getToday } from "@/lib/utils";

export async function GET() {
  const today = getToday();
  const wisdom = getWisdomForDate(today);
  return NextResponse.json({ wisdom, date: today });
}
