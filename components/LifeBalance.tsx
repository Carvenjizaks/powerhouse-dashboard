"use client";

import { cn } from "@/lib/utils";
import { Cross, Heart, Users, Brain, Dumbbell } from "lucide-react";

interface BalanceDimension {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
  principle: string;
  score: number; // 0-100 based on today's tasks
}

export default function LifeBalance() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const dimensions: BalanceDimension[] = [
    {
      id: "spiritual",
      label: "Spiritual",
      icon: <Cross className="w-4 h-4" />,
      color: "#7C3AED",
      bgColor: "#EDE9FE",
      description: "Time with God, prayer, Scripture",
      principle: "Jesus rose early to pray (Mark 1:35)",
      score: 0,
    },
    {
      id: "relational",
      label: "Relational",
      icon: <Users className="w-4 h-4" />,
      color: "#BE185D",
      bgColor: "#FCE7F3",
      description: "Family, discipleship, community",
      principle: "He appointed twelve to be with Him (Mark 3:14)",
      score: 0,
    },
    {
      id: "mental",
      label: "Mental",
      icon: <Brain className="w-4 h-4" />,
      color: "#0284C7",
      bgColor: "#E0F2FE",
      description: "Reading, writing, learning",
      principle: "Be wise as serpents (Matthew 10:16)",
      score: 0,
    },
    {
      id: "physical",
      label: "Physical",
      icon: <Dumbbell className="w-4 h-4" />,
      color: "#059669",
      bgColor: "#D1FAE5",
      description: "Exercise, rest, health",
      principle: "Come away and rest a while (Mark 6:31)",
      score: 0,
    },
    {
      id: "leadership",
      label: "Leadership",
      icon: <Heart className="w-4 h-4" />,
      color: "#D97706",
      bgColor: "#FEF3C7",
      description: "Investing in leaders, serving",
      principle: "The Son of Man came to serve (Mark 10:45)",
      score: 0,
    },
  ];

  return (
    <div className="glass-card p-5 animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-kingdom-400" />
        <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-surface-500">
          Life Balance — Jesus Style
        </h2>
      </div>

      <p className="text-[10px] text-surface-400 mb-4 font-mono">
        Jesus modeled a balanced life: prayer, people, purpose, rest, and mission.
        How is your balance today?
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {dimensions.map((dim) => (
          <div
            key={dim.id}
            className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 hover:shadow-sm text-center"
            style={{ background: dim.bgColor }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${dim.color}15` }}
            >
              <span style={{ color: dim.color }}>{dim.icon}</span>
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: dim.color }}
            >
              {dim.label}
            </span>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: `${dim.color}15` }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${dim.score}%`,
                  background: dim.color,
                }}
              />
            </div>
            <span className="text-[9px] text-surface-400 leading-tight">
              {dim.description}
            </span>
            <span className="text-[8px] text-surface-400 italic leading-tight">
              {dim.principle}
            </span>
          </div>
        ))}
      </div>

      {/* Reflection Prompt */}
      <div
        className="mt-4 p-3 rounded-xl text-xs leading-relaxed"
        style={{
          background: "linear-gradient(135deg, #FEF3C7, #FFFBEB)",
          border: "1px solid #FDE68A",
        }}
      >
        <span className="font-semibold text-amber-700 text-[10px] uppercase tracking-wider block mb-1">
          🙏 Reflection for {today}
        </span>
        <span className="text-amber-800">
          &ldquo;Which dimension of your life is most neglected right now? What ONE thing can you do today to restore balance?&rdquo;
        </span>
      </div>
    </div>
  );
}