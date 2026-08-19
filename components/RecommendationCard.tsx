"use client";

import { cn } from "@/lib/utils";
import {
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  Heart,
  Sparkles,
} from "lucide-react";

interface Recommendation {
  id: number;
  text: string;
  type: string;
  category: string;
  priority: number;
}

const typeConfig: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  tip: {
    icon: <Lightbulb className="w-4 h-4" />,
    color: "#3B82F6",
    bg: "#1E3A5F",
  },
  warning: {
    icon: <AlertTriangle className="w-4 h-4" />,
    color: "#EF4444",
    bg: "#3B1F1F",
  },
  insight: {
    icon: <TrendingUp className="w-4 h-4" />,
    color: "#8B5CF6",
    bg: "#2D1B4E",
  },
  encouragement: {
    icon: <Heart className="w-4 h-4" />,
    color: "#10B981",
    bg: "#1A3A2A",
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
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-dark-300">
            Smart Insights
          </h2>
        </div>
        <p className="text-sm text-dark-500 italic">
          No recommendations yet. Start tracking your day and insights will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-purple-400" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-dark-300">
          Smart Insights
        </h2>
      </div>

      <div className="space-y-2">
        {recommendations.map((rec) => {
          const config = typeConfig[rec.type] || typeConfig.tip;
          return (
            <div
              key={rec.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg transition-all duration-200",
                "hover:bg-dark-700/30"
              )}
              style={{ backgroundColor: `${config.bg}40` }}
            >
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${config.color}20` }}
              >
                <span style={{ color: config.color }}>{config.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: config.color }}
                  >
                    {rec.type}
                  </span>
                  {rec.category !== "general" && (
                    <span className="text-[10px] text-dark-500 uppercase">
                      • {rec.category}
                    </span>
                  )}
                </div>
                <p className="text-xs text-dark-300 mt-0.5 leading-relaxed">
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