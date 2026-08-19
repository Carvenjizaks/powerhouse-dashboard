"use client";

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  label?: string;
  sublabel?: string;
}

export default function ProgressRing({
  percentage,
  size = 100,
  strokeWidth = 8,
  color = "#F59E0B",
  bgColor = "#F5F5F4",
  label,
  sublabel,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1 relative">
      <svg width={size} height={size} className="transform -rotate-90 drop-shadow-sm">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          style={{
            filter: `drop-shadow(0 0 4px ${color}40)`,
          }}
        />
      </svg>
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span
          className="text-lg font-bold tabular-nums"
          style={{ color }}
        >
          {percentage}%
        </span>
      </div>
      {label && (
        <span className="text-[10px] text-surface-400 font-medium uppercase tracking-wider mt-1">
          {label}
        </span>
      )}
      {sublabel && (
        <span className="text-[9px] text-surface-300 font-mono">{sublabel}</span>
      )}
    </div>
  );
}
