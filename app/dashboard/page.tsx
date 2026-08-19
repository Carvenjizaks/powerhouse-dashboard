"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Zap,
  Flame,
  BookOpen,
  Calendar,
  RefreshCw,
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

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(fetchAll, 60000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const handleToggle = async (taskId: number, completed: boolean) => {
    setToggling(taskId);
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed } : t))
    );

    try {
      await fetch("/api/daily-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, completed }),
      });
      // Refresh everything to get updated stats
      await fetchAll();
    } catch (error) {
      console.error("Failed to toggle task:", error);
      // Revert on error
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

  // Group tasks by focus area
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
        <div className="flex flex-col items-center gap-4">
          <Zap className="w-10 h-10 text-powerhouse-500 animate-pulse" />
          <span className="text-sm text-dark-400 font-mono">
            Loading Powerhouse...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* ── Top Bar ──────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-dark-800 bg-dark-950/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-powerhouse-500/10 border border-powerhouse-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-powerhouse-500" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-dark-100 uppercase tracking-wider">
                Carvenjizaks
              </h1>
              <p className="text-[10px] text-dark-500 font-mono">
                {today}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Streak */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-800 border border-dark-700/50">
              <Flame
                className={cn(
                  "w-4 h-4",
                  streak >= 3 ? "text-orange-400" : "text-dark-500"
                )}
              />
              <span
                className={cn(
                  "text-xs font-bold",
                  streak >= 3 ? "text-orange-400" : "text-dark-400"
                )}
              >
                {streak} day{streak !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-lg hover:bg-dark-800 transition-colors text-dark-400 hover:text-dark-200"
            >
              <RefreshCw
                className={cn("w-4 h-4", refreshing && "animate-spin")}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* ── Overview Row ──────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Today's Progress */}
          <div className="glass-card p-4 flex flex-col items-center">
            <ProgressRing
              percentage={stats.percentage}
              size={80}
              strokeWidth={6}
              color="#F59E0B"
              label="Today"
              sublabel={`${stats.completed}/${stats.total}`}
            />
          </div>

          {/* Book Deadline */}
          <div className="glass-card p-4 flex flex-col items-center justify-center">
            <BookOpen className="w-5 h-5 text-purple-400 mb-1" />
            <span className="text-2xl font-bold text-purple-400">
              {bookDeadline.daysLeft}
            </span>
            <span className="text-[10px] text-dark-500 font-medium uppercase tracking-wider">
              Days Left
            </span>
            <span className="text-[9px] text-dark-600 mt-0.5">2 Books</span>
          </div>

          {/* Monthly */}
          <div className="glass-card p-4 flex flex-col items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-400 mb-1" />
            <span className="text-2xl font-bold text-blue-400">
              {monthStats.percentage}%
            </span>
            <span className="text-[10px] text-dark-500 font-medium uppercase tracking-wider">
              Monthly
            </span>
            <span className="text-[9px] text-dark-600 mt-0.5">
              {monthStats.completed}/{monthStats.total} checks
            </span>
          </div>

          {/* Streak */}
          <div className="glass-card p-4 flex flex-col items-center justify-center">
            <Flame
              className={cn(
                "w-5 h-5 mb-1",
                streak >= 3 ? "text-orange-400" : "text-dark-500"
              )}
            />
            <span
              className={cn(
                "text-2xl font-bold",
                streak >= 3 ? "text-orange-400" : "text-dark-400"
              )}
            >
              {streak}
            </span>
            <span className="text-[10px] text-dark-500 font-medium uppercase tracking-wider">
              Day Streak
            </span>
          </div>
        </div>

        {/* ── Task Cards ──────────────────────���──────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Kingdom Building Card */}
          <DashboardCard
            title="KINGDOM BUILDING"
            emoji="👑"
            color="#F59E0B"
            glow={kingdomDone === kingdomTasks.length && kingdomTasks.length > 0}
            stats={{ done: kingdomDone, total: kingdomTasks.length }}
          >
            {kingdomTasks.map((task) => (
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

          {/* Personal Card */}
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

        {/* ── Week Chart ──────────────────────────────── */}
        <WeekChart data={weekData} />

        {/* ── Smart Recommendations ───────────────────── */}
        <RecommendationCard recommendations={recommendations} />

        {/* ── Footer ──────────────────────────────────── */}
        <footer className="text-center pb-8">
          <p className="text-[10px] text-dark-600 font-mono">
            CARVENJIZAKS'S PERSONAL DASHBOARD v1.0 | KINGDOM BUILDING •{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </footer>
      </main>
    </div>
  );
}
