"use client";

import { cn } from "@/lib/utils";

interface DayData {
  date: string;
  dayName: string;
  total: number;
  done: number;
  percentage: number;
}

interface WeekChartProps {
  data: DayData[];
  color?: string;
}

export default function WeekChart({
  data,
  color = "#F59E0B",
}: WeekChartProps) {
  return (
    <div className="glass-card p-5 animate-slide-up">
      <div className="flex items-center gap-2 mb-5">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: color }}
        />
        <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-surface-500">
          This Week
        </h2>
      </div>

      <div className="flex items-end justify-between gap-2 h-28 px-1">
        {data.map((day, i) => {
          const height = Math.max(
            (day.percentage / 100) * 100,
            day.percentage > 0 ? 4 : 0
          );
          const isToday =
            day.date === new Date().toISOString().split("T")[0];
          const isFull = day.percentage === 100;

          return (
            <div
              key={day.date}
              className="flex flex-col items-center gap-1.5 flex-1"
            >
              {/* Bar container */}
              <div className="relative w-full h-full flex items-end justify-center group">
                {/* Percentage label on hover */}
                <div
                  className="absolute -top-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <span
                    className="text-[10px] font-bold tabular-nums"
                    style={{ color }}
                  >
                    {day.percentage}%
                  </span>
                </div>

                {/* Bar */}
                <div
                  className={cn(
                    "w-full rounded-lg transition-all duration-500 relative overflow-hidden",
                    isToday && "shadow-md"
                  )}
                  style={{
                    height: `${height}%`,
                    minHeight: day.percentage > 0 ? "4px" : "2px",
                    background:
                      day.percentage === 0
                        ? "#F5F5F4"
                        : `linear-gradient(to top, ${color}, ${color}88)`,
                    boxShadow:
                      isFull
                        ? `0 0 12px ${color}40`
                        : day.percentage > 0
                        ? `0 2px 8px ${color}20`
                        : "none",
                  }}
                >
                  {/* Glow on full */}
                  {isFull && (
                    <div
                      className="absolute inset-0 rounded-lg animate-pulse-glow"
                      style={{
                        background: `linear-gradient(to top, ${color}30, transparent)`,
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Day label */}
              <span
                className={cn(
                  "text-[10px] font-medium tracking-wider",
                  isToday ? "text-surface-600 font-bold" : "text-surface-400"
                )}
              >
                {day.dayName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
