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
        glow && (color === "#F59E0B" ? "glow-kingdom" : "glow-personal"),
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{
              background: `linear-gradient(135deg, ${color}15, ${color}08)`,
              border: `1px solid ${color}20`,
            }}
          >
            {emoji}
          </div>
          <h2
            className="text-xs font-bold uppercase tracking-[0.15em]"
            style={{ color }}
          >
            {title}
          </h2>
        </div>
        {stats && (
          <div className="flex items-center gap-2.5">
            {/* Mini progress bar */}
            <div
              className="h-2 w-16 rounded-full overflow-hidden"
              style={{ background: `${color}15` }}
            >
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${percentage}%`,
                  background: `linear-gradient(90deg, ${color}, ${color}88)`,
                }}
              />
            </div>
            <span
              className="text-xs font-bold tabular-nums"
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
