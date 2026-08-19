"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  emoji: string;
  color: string;
  children: ReactNode;
  className?: string;
  glow?: boolean;
  stats?: {
    done: number;
    total: number;
  };
}

export default function DashboardCard({
  title,
  emoji,
  color,
  children,
  className,
  glow,
  stats,
}: DashboardCardProps) {
  const percentage = stats ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div
      className={cn(
        "glass-card p-5 animate-slide-up",
        glow && (color === "#F59E0B" ? "glow-amber" : "glow-emerald"),
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <h2
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color }}
          >
            {title}
          </h2>
        </div>
        {stats && (
          <div className="flex items-center gap-2">
            <div
              className="h-1.5 w-20 rounded-full overflow-hidden bg-dark-700"
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: color,
                }}
              />
            </div>
            <span
              className="text-xs font-bold"
              style={{ color }}
            >
              {stats.done}/{stats.total}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">{children}</div>
    </div>
  );
}