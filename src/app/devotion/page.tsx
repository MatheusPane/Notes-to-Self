"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { BookMarked, ArrowLeft, Save, Loader2, Check, Sparkles } from "lucide-react";
import { createEntry } from "@/app/actions/journalActions";
import { useLanguage } from "@/context/LanguageContext";

const DRAFT_KEY = "notes_to_self_devotion_draft";

export default function DevotionPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const d = t.devotionPage;

  const [scriptureRef, setScriptureRef] = useState("");
  const [verseText, setVerseText] = useState("");
  const [reflection, setReflection] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Auto-restore draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.scriptureRef) setScriptureRef(parsed.scriptureRef);
        if (parsed.verseText) setVerseText(parsed.verseText);
        if (parsed.reflection) setReflection(parsed.reflection);
      } catch {
        // ignore fallback
      }
    }
  }, []);

  // Auto-save draft to localStorage on type
  useEffect(() => {
    if (!scriptureRef.trim() && !verseText.trim() && !reflection.trim()) return;
    const timer = setTimeout(() => {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ scriptureRef, verseText, reflection })
      );
      setLastSavedTime(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [scriptureRef, verseText, reflection]);

  const hasContent = scriptureRef.trim() || reflection.trim();

  const handleSave = useCallback(async () => {
    if (!hasContent || saving) return;
    setSaving(true);
    try {
      const titleText = scriptureRef.trim() || d.spaceTitle;
      const fullContent = [
        verseText.trim() ? `> "${verseText.trim()}"` : "",
        reflection.trim(),
      ]
        .filter(Boolean)
        .join("\n\n");

      await createEntry({
        mode: "devotion",
        title: titleText,
        content: fullContent,
      });

      localStorage.removeItem(DRAFT_KEY);
      setSaved(true);
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (err) {
      console.error("Failed to save devotion entry:", err);
    } finally {
      setSaving(false);
    }
  }, [scriptureRef, verseText, reflection, hasContent, saving, router, d.spaceTitle]);

  const totalWords = (verseText + " " + reflection).trim()
    ? (verseText + " " + reflection).trim().split(/\s+/).length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/60 via-cream to-amber-100/30 dark:from-[#141419] dark:via-[#18181f] dark:to-[#121216] pb-16 transition-colors duration-300">
      {/* Ambient Peaceful Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-amber-500/10 dark:bg-amber-400/5 blur-[120px]"
        />
      </div>

      {/* Top Navigation Header Bar */}
      <div className="sticky top-0 z-30 glass bg-amber-50/80 dark:bg-[#1a1a22]/90 backdrop-blur-md border-b border-amber-200/40 dark:border-amber-900/30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 text-sm font-medium text-stone-700 dark:text-gray-300 hover:text-stone-900 dark:hover:text-white transition-colors px-3 py-1.5 rounded-xl hover:bg-white/40 dark:hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{d.backToDashboard}</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 dark:bg-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-300 shadow-xs">
              <BookMarked className="w-4 h-4" />
            </div>
            <span className="font-serif text-base font-bold text-stone-900 dark:text-white">
              {d.spaceTitle}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={!hasContent || saving}
            className="flex items-center gap-2 px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium rounded-xl disabled:opacity-40 transition-colors shadow-xs"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{d.saveEntry}</span>
          </motion.button>
        </div>
      </div>

      {/* Centered Floating Classic Book Paper Canvas */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="paper-devotion rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-200/50 dark:border-amber-900/40 space-y-6">
          {saved ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500/20 dark:bg-amber-500/20 flex items-center justify-center mb-4 text-amber-700 dark:text-amber-300 shadow-xs">
                <Check className="w-8 h-8" />
              </div>
              <p className="font-serif text-2xl text-stone-900 dark:text-white font-bold">
                {d.savedTitle}
              </p>
              <p className="text-sm text-stone-600 dark:text-gray-300 mt-1">
                {d.savedSub}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Field 1: Scripture Reference (Title) */}
              <div>
                <label className="block text-xs font-semibold text-amber-900/70 dark:text-amber-300 uppercase tracking-wider mb-1">
                  {d.scriptureRefLabel}
                </label>
                <input
                  type="text"
                  value={scriptureRef}
                  onChange={(e) => setScriptureRef(e.target.value)}
                  placeholder={d.scriptureRefPlaceholder}
                  className="w-full bg-transparent border-b border-amber-900/20 dark:border-zinc-700 pb-3 outline-none font-serif text-2xl sm:text-3xl text-stone-900 dark:text-white font-bold placeholder:text-stone-400 dark:placeholder:text-zinc-500"
                />
              </div>

              {/* Field 2: The Verse (Optional Indented Quote Box) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-amber-900/70 dark:text-amber-300 uppercase tracking-wider">
                  {d.verseLabel}
                </label>
                <div className="border-l-4 border-amber-600/50 dark:border-amber-500/50 pl-4 py-2 bg-amber-500/5 dark:bg-zinc-900/60 rounded-r-2xl border border-amber-200/40 dark:border-zinc-800">
                  <textarea
                    value={verseText}
                    onChange={(e) => setVerseText(e.target.value)}
                    placeholder={d.versePlaceholder}
                    className="w-full bg-transparent border-none outline-none resize-none font-serif italic text-base sm:text-lg text-stone-800 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 leading-relaxed min-h-[80px]"
                    rows={3}
                  />
                </div>
              </div>

              {/* Field 3: My Reflection & Summary */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-amber-900/70 dark:text-amber-300 uppercase tracking-wider">
                  {d.reflectionLabel}
                </label>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder={d.reflectionPlaceholder}
                  autoFocus
                  className="w-full bg-transparent border-none outline-none resize-none font-serif text-base sm:text-lg text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-zinc-500 leading-relaxed min-h-[300px] md:min-h-[350px]"
                />
              </div>

              {/* Footer Reading & Auto-save Status Bar */}
              <div className="pt-4 border-t border-amber-900/20 dark:border-zinc-700/60 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500 dark:text-gray-300 font-sans">
                <div className="flex items-center gap-4">
                  <span>
                    {totalWords} {d.words}
                  </span>
                  <span>•</span>
                  <span>
                    {scriptureRef.length + verseText.length + reflection.length} {d.characters}
                  </span>
                </div>

                {lastSavedTime && (
                  <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {d.autoSaved} {lastSavedTime}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
