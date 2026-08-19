"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Crown,
  Flame,
  BookOpen,
  Calendar,
  RefreshCw,
  Target,
} from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import TaskItem from "@/components/TaskItem";
import ProgressRing from "@/components/ProgressRing";
import WeekChart from "@/components/WeekChart";
import RecommendationCard from "@/components/RecommendationCard";
import { cn } from "@/lib/utils";

interface Task {
  id: number;
  code: string;
  title: string;
  description: string;
  target?: string | null;
  targetDate?: string | null;
  completed: boolean;
  focusAreaId: number;
  focusAreaSlug: string;
  focusAreaName: string;
  focusAreaColor: string;
  focusAreaEmoji: string;
}

interface Stats {
  total: number;
  completed: number;
  percentage: number;
}

interface WeekDay {
  date: string;
  dayName: string;
  total: number;
  done: number;
  percentage: number;
}

interface MonthStats {
  total: number;
  completed: number;
  percentage: number;
}

interface BookDeadline {
  date: string;
  daysLeft: number;
}

interface Recommendation {
  id: number;
  text: string;
  type: string;
  category: string;
  priority: number;
  date: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, completed: 0, percentage: 0 });
  const [weekData, setWeekData] = useState<WeekDay[]>([]);
  const [monthStats, setMonthStats] = useState<MonthStats>({
    total: 0,
    completed: 0,
    percentage: 0,
  });
  const [streak, setStreak] = useState(0);
  const [bookDeadline, setBookDeadline] = useState<BookDeadline>({
    date: "2026-11-30",
    daysLeft: 103,
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [tasksRes, progressRes, recsRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/progress"),
        fetch("/api/recommendations"),
      ]);
      const tasksData = await tasksRes.json();
      const progressData = await progressRes.json();
      const recsData = await recsRes.json();

      setTasks(tasksData.tasks);
      setStats(tasksData.stats);
      setWeekData(progressData.week);
      setMonthStats(progressData.month);
      setStreak(progressData.streak);
      setBookDeadline(progressData.bookDeadline);
      setRecommendations(recsData.recommendations);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    const interval = setInterval(fetchAll, 60000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const handleToggle = async (taskId: number, completed: boolean) => {
    setToggling(taskId);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed } : t))
    );

    try {
      await fetch("/api/daily-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, completed }),
      });
      await fetchAll();
    } catch (error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: !completed } : t))
      );
    } finally {
      setToggling(null);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAll();
  };

  const kingdomTasks = tasks.filter((t) => t.focusAreaSlug === "kingdom-building");
  const personalTasks = tasks.filter((t) => t.focusAreaSlug === "personal");

  const kingdomDone = kingdomTasks.filter((t) => t.completed).length;
  const personalDone = personalTasks.filter((t) => t.completed).length;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="flex flex-col items-center gap-4 p-10 rounded-3xl"
          style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(20px)" }}
        >
          <Crown className="w-10 h-10 text-kingdom-400 animate-breathe" />
          <span className="text-sm text-surface-400 font-mono tracking-wider">
            Loading Dashboard...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-12">
      {/* ── Floating background blobs ─────────────────── */}
      <div className="blob-1" />
      <div className="blob-2" />
      <div className="blob-3" />

      {/* ── Top Bar ──────────────────────────────────── */}
      <header className="sticky top-3 z-50 max-w-5xl mx-auto px-4">
        <div
          className="rounded-2xl px-5 py-3 flex items-center justify-between"
          style={{
            background: "rgba(255, 255, 255, 0.72)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            boxShadow: "0 4px 24px rgba(149, 157, 165, 0.1)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-kingdom flex items-center justify-center shadow-sm">
              <Crown className="w-5 h-5 text-kingdom-600" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-surface-800 uppercase tracking-wider">
                Carvenjizaks
              </h1>
              <p className="text-[10px] text-surface-400 font-mono">
                {today}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Streak */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{
                background: streak >= 3
                  ? "linear-gradient(135deg, #FEF3C7, #FDE68A)"
                  : "rgba(255,255,255,0.6)",
                border: "1px solid",
                borderColor: streak >= 3 ? "#FCD34D" : "rgba(255,255,255,0.8)",
              }}
            >
              <Flame
                className={cn(
                  "w-4 h-4",
                  streak >= 3 ? "text-amber-500" : "text-surface-300"
                )}
              />
              <span
                className={cn(
                  "text-xs font-bold",
                  streak >= 3 ? "text-amber-700" : "text-surface-400"
                )}
              >
                {streak} day{streak !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-xl transition-all duration-200 hover:bg-white/60 text-surface-400 hover:text-surface-600"
              style={{ border: "1px solid rgba(255,255,255,0.8)" }}
            >
              <RefreshCw
                className={cn("w-4 h-4", refreshing && "animate-spin")}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {/* ── Overview Row ──────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass-card p-4 flex flex-col items-center animate-scale-in">
            <ProgressRing
              percentage={stats.percentage}
              size={80}
              strokeWidth={6}
              color="#F59E0B"
              label="Today"
              sublabel={`${stats.completed}/${stats.total}`}
            />
          </div>

          <div className="glass-card p-4 flex flex-col items-center justify-center animate-scale-in" style={{ animationDelay: "0.1s" }}>
            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center mb-1.5">
              <BookOpen className="w-4.5 h-4.5 text-purple-500" />
            </div>
            <span className="text-2xl font-bold text-purple-500">
              {bookDeadline.daysLeft}
            </span>
            <span className="text-[10px] text-surface-400 font-medium uppercase tracking-wider">
              Days Left
            </span>
            <span className="text-[9px] text-surface-300 mt-0.5">2 Books</span>
          </div>

          <div className="glass-card p-4 flex flex-col items-center justify-center animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center mb-1.5">
              <Calendar className="w-4.5 h-4.5 text-blue-500" />
            </div>
            <span className="text-2xl font-bold text-blue-500">
              {monthStats.percentage}%
            </span>
            <span className="text-[10px] text-surface-400 font-medium uppercase tracking-wider">
              Monthly
            </span>
            <span className="text-[9px] text-surface-300 mt-0.5">
              {monthStats.completed}/{monthStats.total} checks
            </span>
          </div>

          <div className="glass-card p-4 flex flex-col items-center justify-center animate-scale-in" style={{ animationDelay: "0.3s" }}>
            <Flame
              className={cn(
                "w-5 h-5 mb-1.5",
                streak >= 3 ? "text-amber-500" : "text-surface-300"
              )}
            />
            <span
              className={cn(
                "text-2xl font-bold",
                streak >= 3 ? "text-amber-500" : "text-surface-400"
              )}
            >
              {streak}
            </span>
            <span className="text-[10px] text-surface-400 font-medium uppercase tracking-wider">
              Day Streak
            </span>
          </div>
        </div>

        {/* ── Task Cards ──────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DashboardCard
            title="KINGDOM BUILDING"
            emoji="👑"
            color="#F59E0B"
            glow={kingdomDone === kingdomTasks.length && kingdomTasks.length > 0}
            stats={{ done: kingdomDone, total: kingdomTasks.length }}
          >
            {kingdomTasks.map((task, i) => (
              <TaskItem
                key={task.id}
                {...task}
                color="#F59E0B"
                emoji="👑"
                onToggle={handleToggle}
                disabled={toggling === task.id}
              />
            ))}
          </DashboardCard>

          <DashboardCard
            title="PERSONAL"
            emoji="🧑"
            color="#10B981"
            glow={personalDone === personalTasks.length && personalTasks.length > 0}
            stats={{ done: personalDone, total: personalTasks.length }}
          >
            {personalTasks.map((task) => (
              <TaskItem
                key={task.id}
                {...task}
                color="#10B981"
                emoji="🧑"
                onToggle={handleToggle}
                disabled={toggling === task.id}
              />
            ))}
          </DashboardCard>
        </div>

        {/* ── Week Chart ─────��────────────────────────── */}
        <WeekChart data={weekData} />

        {/* ── Smart Recommendations ───────────────────── */}
        <RecommendationCard recommendations={recommendations} />

        {/* ── Footer ──────────────────────────────────── */}
        <footer className="text-center pt-2">
          <div
            className="inline-block px-5 py-2 rounded-full"
            style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(8px)" }}
          >
            <p className="text-[10px] text-surface-400 font-mono tracking-wider">
              CARVENJIZAKS'S PERSONAL DASHBOARD v1.0
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
