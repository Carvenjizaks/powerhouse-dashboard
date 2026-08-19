"use client";

import { cn } from "@/lib/utils";
import {
  Lightbulb,
  AlertTriangle,
  Heart,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface Recommendation {
  id: number;
  text: string;
  type: string;
  category: string;
  priority: number;
}

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  tip: {
    icon: <Lightbulb className="w-3.5 h-3.5" />,
    color: "#6366F1",
    bg: "#EEF2FF",
  },
  warning: {
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
  insight: {
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
  encouragement: {
    icon: <Heart className="w-3.5 h-3.5" />,
    color: "#EC4899",
    bg: "#FDF2F8",
  },
};

export default function RecommendationCard({
  recommendations,
}: {
  recommendations: Recommendation[];
}) {
  if (recommendations.length === 0) {
    return (
      <div className="glass-card p-5 animate-slide-up">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-surface-500">
            Smart Insights
          </h2>
        </div>
        <p className="text-sm text-surface-400 italic">
          No recommendations yet. Start tracking and insights will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-purple-400" />
        <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-surface-500">
          Smart Insights
        </h2>
      </div>

      <div className="space-y-2">
        {recommendations.map((rec) => {
          const cfg = typeConfig[rec.type] || typeConfig.tip;
          return (
            <div
              key={rec.id}
              className="flex items-start gap-3 p-3.5 rounded-xl transition-all duration-200 hover:shadow-sm"
              style={{ background: cfg.bg }}
            >
              <div
                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: `${cfg.color}15` }}
              >
                <span style={{ color: cfg.color }}>{cfg.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider"
                    style={{ color: cfg.color }}
                  >
                    {rec.type}
                  </span>
                  {rec.category !== "general" && (
                    <span className="text-[9px] text-surface-400 uppercase tracking-wider">
                      • {rec.category}
                    </span>
                  )}
                </div>
                <p className="text-xs text-surface-600 leading-relaxed">
                  {rec.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
