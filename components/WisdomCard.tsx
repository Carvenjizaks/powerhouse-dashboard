"use client";

import { Quote, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface WisdomEntry {
  id: number;
  quote: string;
  author: string;
  source: string;
  category: string;
  application: string;
}

const categoryColors: Record<string, { bg: string; accent: string; label: string }> = {
  leadership: { bg: "#FEF3C7", accent: "#D97706", label: "Leadership" },
  discipline: { bg: "#FCE4EC", accent: "#DB2777", label: "Discipline" },
  time:       { bg: "#E0F2FE", accent: "#0284C7", label: "Time" },
  purpose:    { bg: "#EDE9FE", accent: "#7C3AED", label: "Purpose" },
  rest:       { bg: "#D1FAE5", accent: "#059669", label: "Rest" },
  people:     { bg: "#FCE7F3", accent: "#BE185D", label: "People" },
  faith:      { bg: "#FFE4E6", accent: "#E11D48", label: "Faith" },
};

export default function WisdomCard({ wisdom }: { wisdom: WisdomEntry }) {
  const cat = categoryColors[wisdom.category] || categoryColors.purpose;

  return (
    <div
      className="glass-card p-5 animate-slide-up overflow-hidden relative"
    >
      {/* Decorative accent bar */}
      <div
        className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
        style={{ background: cat.accent }}
      />

      <div className="flex items-start gap-3 ml-2">
        {/* Icon */}
        <div
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: cat.bg }}
        >
          <Quote className="w-4 h-4" style={{ color: cat.accent }} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Category badge */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full"
              style={{
                background: cat.bg,
                color: cat.accent,
              }}
            >
              {cat.label}
            </span>
            <BookOpen className="w-3 h-3 text-surface-300" />
            <span className="text-[9px] text-surface-400 font-mono truncate">
              {wisdom.source}
            </span>
          </div>

          {/* Quote */}
          <blockquote className="text-sm font-medium text-surface-700 leading-relaxed italic">
            &ldquo;{wisdom.quote}&rdquo;
          </blockquote>

          {/* Author */}
          <p className="text-xs font-semibold text-surface-500 mt-2">
            — {wisdom.author}
          </p>

          {/* Application — practical takeaway */}
          <div
            className="mt-3 p-3 rounded-xl text-xs leading-relaxed"
            style={{
              background: `linear-gradient(135deg, ${cat.accent}06, ${cat.accent}02)`,
              border: `1px solid ${cat.accent}12`,
            }}
          >
            <span className="font-semibold text-surface-500 text-[10px] uppercase tracking-wider block mb-1">
              🎯 Apply Today
            </span>
            <span className="text-surface-600">
              {wisdom.application}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
