"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

interface TaskItemProps {
  id: number;
  code: string;
  title: string;
  description: string;
  completed: boolean;
  color: string;
  emoji: string;
  target?: string | null;
  onToggle: (taskId: number, completed: boolean) => void;
  disabled?: boolean;
}

export default function TaskItem({
  id,
  code,
  title,
  description,
  completed,
  color,
  emoji,
  target,
  onToggle,
  disabled,
}: TaskItemProps) {
  const pastelBg = completed
    ? `${color}08`
    : "rgba(255,255,255,0.4)";
  const borderColor = completed
    ? `${color}30`
    : "rgba(255,255,255,0.5)";

  return (
    <button
      onClick={() => onToggle(id, !completed)}
      disabled={disabled}
      className={cn(
        "group flex items-start gap-3 w-full p-3 rounded-xl transition-all duration-200 text-left",
        "hover:shadow-sm active:scale-[0.98]",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      style={{
        background: pastelBg,
        border: `1px solid ${borderColor}`,
      }}
    >
      {/* Checkbox */}
      <div className="mt-0.5 flex-shrink-0">
        {completed ? (
          <CheckCircle2
            className="w-5 h-5 transition-all duration-300"
            style={{ color }}
          />
        ) : (
          <Circle
            className="w-5 h-5 transition-colors duration-200"
            style={{ color: "#D6D3D1" }}
            strokeWidth={1.5}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-surface-400">
            {emoji} {code.toUpperCase()}
          </span>
          {target && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{
                background: `${color}12`,
                color: color,
              }}
            >
              {target}
            </span>
          )}
        </div>
        <h3
          className={cn(
            "text-sm font-semibold mt-0.5 transition-all",
            completed
              ? "text-surface-300 line-through"
              : "text-surface-700"
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "text-xs mt-0.5 transition-all leading-relaxed",
            completed ? "text-surface-300" : "text-surface-400"
          )}
        >
          {description}
        </p>
      </div>
    </button>
  );
}
