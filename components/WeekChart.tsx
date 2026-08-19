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
  const maxPercentage = Math.max(...data.map((d) => d.percentage), 1);

  return (
    <div className="glass-card p-5 animate-slide-up">
      <h2 className="text-sm font-bold uppercase tracking-widest text-dark-300 mb-4">
        📊 This Week
      </h2>

      <div className="flex items-end justify-between gap-2 h-32">
        {data.map((day) => {
          const height = Math.max(
            (day.percentage / 100) * 100,
            day.percentage > 0 ? 4 : 0
          );
          return (
            <div
              key={day.date}
              className="flex flex-col items-center gap-1 flex-1"
            >
              {/* Bar */}
              <div className="relative w-full h-full flex items-end justify-center">
                {/* Tooltip */}
                <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-bold" style={{ color }}>
                    {day.percentage}%
                  </span>
                </div>

                <div
                  className="w-full rounded-t-md transition-all duration-500 group cursor-pointer relative"
                  style={{
                    height: `${height}%`,
                    backgroundColor:
                      day.percentage === 100
                        ? color
                        : day.percentage > 0
                        ? `${color}60`
                        : "#1E293B",
                    minHeight: day.percentage > 0 ? "4px" : "2px",
                  }}
                >
                  {/* Glow on full completion */}
                  {day.percentage === 100 && (
                    <div
                      className="absolute inset-0 rounded-t-md animate-pulse-glow"
                      style={{
                        background: `linear-gradient(to top, ${color}, transparent)`,
                        opacity: 0.3,
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Day label */}
              <span className="text-[10px] text-dark-500 font-medium">
                {day.dayName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}