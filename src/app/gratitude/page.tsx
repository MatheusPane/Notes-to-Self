"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Heart, ArrowLeft, Save, Loader2, Sparkles } from "lucide-react";
import { createEntry } from "@/app/actions/journalActions";

const PROMPTS = [
  "What made you smile today?",
  "A small win you're proud of:",
  "Someone or something you appreciate:",
];

export default function GratitudePage() {
  const router = useRouter();
  const [entries, setEntries] = useState(["", "", ""]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateEntry = (index: number, value: string) => {
    setEntries((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const hasContent = entries.some((e) => e.trim());

  const handleSave = useCallback(async () => {
    if (!hasContent || saving) return;
    setSaving(true);
    try {
      const content = entries
        .map((e, i) => (e.trim() ? `${i + 1}. ${e.trim()}` : null))
        .filter(Boolean)
        .join("\n\n");

      await createEntry({ mode: "gratitude", content });
      setSaved(true);
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  }, [entries, hasContent, saving, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-peach-light via-cream to-peach/30 dark:from-[#191512] dark:via-[#151210] dark:to-[#171311] pb-16 transition-colors duration-300">
      {/* Ambient warmth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-peach/25 dark:bg-orange-500/10 blur-[100px]"
        />
      </div>

      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 glass bg-peach-light/80 dark:bg-[#1f1b18]/90 backdrop-blur-md border-b border-peach/20 dark:border-orange-900/30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 text-sm font-medium text-amber-900/70 dark:text-amber-200/80 hover:text-amber-950 dark:hover:text-amber-100 transition-colors px-3 py-1.5 rounded-xl hover:bg-white/40 dark:hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-peach/40 dark:bg-orange-500/20 flex items-center justify-center text-peach-dark dark:text-orange-300 shadow-xs">
              <Heart className="w-4 h-4" />
            </div>
            <span className="font-serif text-base font-bold text-amber-950 dark:text-amber-100">
              Gratitude Space
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={!hasContent || saving}
            className="flex items-center gap-2 px-5 py-2 bg-peach-dark hover:bg-peach text-white text-sm font-medium rounded-xl disabled:opacity-40 transition-colors shadow-xs"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Gratitude</span>
          </motion.button>
        </div>
      </div>

      {/* Centered Floating Paper Card Canvas */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="paper-gratitude rounded-3xl p-6 sm:p-10 shadow-xl border border-orange-200/60 dark:border-orange-900/40 space-y-6">
          {saved ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-16 h-16 rounded-full bg-peach/30 dark:bg-orange-500/20 flex items-center justify-center mb-4 text-peach-dark dark:text-orange-300 shadow-xs"
              >
                <Sparkles className="w-8 h-8" />
              </motion.div>
              <p className="font-serif text-2xl text-amber-950 dark:text-amber-100 font-bold">
                Gratitude Captured 🌻
              </p>
              <p className="text-sm text-amber-800/70 dark:text-amber-200/70 mt-1">
                Your heart is full. Redirecting to dashboard...
              </p>
            </motion.div>
          ) : (
            <>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-xl sm:text-2xl text-amber-950 dark:text-amber-100 font-bold leading-relaxed border-b border-orange-300/40 dark:border-orange-900/40 pb-4"
              >
                What are 3 small things that made you smile today?
              </motion.h1>

              <div className="space-y-5 pt-2">
                {PROMPTS.map((prompt, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="bg-white/80 dark:bg-[#27211c]/80 rounded-2xl p-5 border border-orange-200/50 dark:border-orange-900/40 shadow-xs focus-within:ring-2 focus-within:ring-peach-dark/40 dark:focus-within:ring-orange-500/40 transition-all"
                  >
                    <label className="block text-sm font-bold text-amber-950 dark:text-amber-100 mb-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-peach/40 dark:bg-orange-900/50 rounded-full text-xs font-bold text-amber-950 dark:text-amber-100 mr-2">
                        {i + 1}
                      </span>
                      {prompt}
                    </label>
                    <textarea
                      value={entries[i]}
                      onChange={(e) => updateEntry(i, e.target.value)}
                      placeholder="Write your note..."
                      className="w-full bg-transparent border-none outline-none resize-none font-serif text-base text-amber-950 dark:text-amber-50 placeholder:text-amber-900/40 dark:placeholder:text-amber-200/40 placeholder:italic leading-relaxed min-h-[70px]"
                      rows={2}
                    />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
