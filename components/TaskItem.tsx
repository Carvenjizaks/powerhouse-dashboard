"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

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
  return (
    <button
      onClick={() => onToggle(id, !completed)}
      disabled={disabled}
      className={cn(
        "group flex items-start gap-3 w-full p-3 rounded-lg transition-all duration-200 text-left",
        "hover:bg-dark-700/50 active:scale-[0.98]",
        completed
          ? "bg-dark-800/50 border border-dark-700/30"
          : "bg-dark-850/50 border border-dark-700/20",
        disabled && "opacity-50 cursor-not-allowed"
      )}
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
            className="w-5 h-5 text-dark-500 group-hover:text-dark-400 transition-colors duration-200"
            strokeWidth={1.5}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider opacity-60">
            {emoji} {code.toUpperCase()}
          </span>
          {target && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: `${color}15`,
                color: color,
              }}
            >
              {target}
            </span>
          )}
        </div>
        <h3
          className={cn(
            "text-sm font-semibold mt-0.5 transition-colors",
            completed ? "text-dark-400 line-through" : "text-dark-100"
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "text-xs mt-0.5 transition-colors",
            completed ? "text-dark-500" : "text-dark-400"
          )}
        >
          {description}
        </p>
      </div>
    </button>
  );
}