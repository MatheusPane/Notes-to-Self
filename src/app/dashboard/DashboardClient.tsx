"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import MoodTracker from "@/components/MoodTracker";
import ModeSelector from "@/components/ModeSelector";
import AmbientPlayer from "@/components/AmbientPlayer";
import { MODES } from "@/lib/modes";
import { BookOpen, TrendingUp, Sparkles, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface RecentEntry {
  id: string;
  mode: string;
  content: string;
  createdAt: string;
  burned: boolean;
}

interface DashboardClientProps {
  userName: string;
  todayMood: string | null;
  recentEntries: RecentEntry[];
  entryCount: number;
}

export default function DashboardClient({
  userName,
  todayMood,
  recentEntries,
  entryCount,
}: DashboardClientProps) {
  const { language, t } = useLanguage();

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 6) return t.dashboard.greetingLateNight;
    if (hour < 12) return t.dashboard.greetingMorning;
    if (hour < 17) return t.dashboard.greetingAfternoon;
    if (hour < 21) return t.dashboard.greetingEvening;
    return t.dashboard.greetingNightOwl;
  };

  const getDateString = (): string => {
    return new Date().toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-cream pb-16 md:pb-12">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="space-y-8">
          {/* Header Greeting & Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 glass bg-white/40 p-6 sm:p-8 rounded-3xl border border-broken-white/80 shadow-xs"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                <Clock className="w-3.5 h-3.5 text-sage-dark" />
                <span>{getDateString()}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-navy">
                {getGreeting()}, <span className="text-sage-dark">{userName}</span>.
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-sage/15 rounded-2xl border border-sage/20 text-navy">
                <BookOpen className="w-4 h-4 text-sage-dark" />
                <span className="text-sm font-semibold">
                  {entryCount}{" "}
                  {entryCount === 1
                    ? t.dashboard.entriesCountOne
                    : t.dashboard.entriesCountMany}
                </span>
              </div>
              <Link
                href="/archive"
                className="flex items-center gap-1.5 px-4 py-2 bg-navy hover:bg-navy/90 text-white rounded-2xl text-sm font-semibold transition-all shadow-xs hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.dashboard.archiveButton}</span>
              </Link>
            </div>
          </motion.div>

          {/* Daily Mood Tracker Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <MoodTracker initialMood={todayMood} />
          </motion.div>

          {/* Journaling Mode Selector Grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <ModeSelector />
          </motion.div>
        </div>
      </main>

      {/* Ambient Sound Player */}
      <AmbientPlayer />
    </div>
  );
}
