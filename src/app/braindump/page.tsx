"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Brain, ArrowLeft, Save, Loader2, Maximize2, Minimize2, Check, Sparkles } from "lucide-react";
import { createEntry } from "@/app/actions/journalActions";

const DRAFT_KEY = "notes_to_self_braindump_draft";

export default function BrainDumpPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Load auto-save draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.content) setContent(parsed.content);
        if (parsed.title) setTitle(parsed.title);
      } catch {
        // ignore fallback
      }
    }
  }, []);

  // Local storage auto-save draft on type
  useEffect(() => {
    if (!content.trim() && !title.trim()) return;
    const timer = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, content }));
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);

    return () => clearTimeout(timer);
  }, [content, title]);

  const handleSave = useCallback(async () => {
    if (!content.trim() || saving) return;
    setSaving(true);
    try {
      await createEntry({
        mode: "braindump",
        title: title.trim() || undefined,
        content: content.trim(),
      });
      localStorage.removeItem(DRAFT_KEY);
      setSaved(true);
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (err) {
      console.error("Failed to save braindump:", err);
    } finally {
      setSaving(false);
    }
  }, [content, title, saving, router]);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <div className={`min-h-screen pb-16 transition-colors duration-500 ${isFocusMode ? "bg-[#faf9f6]" : "bg-gradient-to-br from-cream via-warm-white to-broken-white"}`}>
      {/* Top Header Bar */}
      <AnimatePresence>
        {!isFocusMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sticky top-0 z-30 glass bg-cream/85 backdrop-blur-md border-b border-broken-white/80 shadow-xs"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-charcoal transition-colors px-3 py-1.5 rounded-xl hover:bg-white/40"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-warm-white border border-broken-white flex items-center justify-center text-charcoal shadow-xs">
                  <Brain className="w-4 h-4" />
                </div>
                <span className="font-serif text-base font-bold text-navy">
                  Brain Dump Mode
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFocusMode(true)}
                  title="Focus Mode"
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-muted hover:text-charcoal bg-white/60 hover:bg-white rounded-xl transition-colors border border-broken-white/80 shadow-xs"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Focus Mode</span>
                </button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={!content.trim() || saving}
                  className="flex items-center gap-2 px-5 py-2 bg-sage-dark hover:bg-sage text-white text-sm font-medium rounded-xl disabled:opacity-40 transition-colors shadow-xs"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save Entry</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Focus Mode Exit Floating Button */}
      {isFocusMode && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          whileHover={{ opacity: 1, scale: 1.05 }}
          onClick={() => setIsFocusMode(false)}
          className="fixed top-6 right-6 z-40 flex items-center gap-2 px-4 py-2 bg-white/90 glass text-muted text-xs font-semibold rounded-full shadow-md border border-broken-white"
        >
          <Minimize2 className="w-4 h-4 text-sage-dark" />
          Exit Focus Mode
        </motion.button>
      )}

      {/* Centered Floating Paper Canvas Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className={`bg-white/70 glass rounded-3xl p-6 sm:p-10 shadow-xl border border-broken-white/80 space-y-6 ${isFocusMode ? "!bg-transparent !border-none !shadow-none" : ""}`}>
          {saved ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mb-4 text-sage-dark shadow-xs">
                <Check className="w-8 h-8" />
              </div>
              <p className="font-serif text-2xl text-navy font-bold">
                Brain Dump Captured 🧠
              </p>
              <p className="text-sm text-muted mt-1">Your mind is clear and free. Redirecting...</p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Title Input */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (optional)..."
                className="w-full bg-transparent border-b border-broken-white/60 pb-3 outline-none font-serif text-2xl sm:text-3xl text-navy font-bold placeholder:text-muted/40 placeholder:font-serif"
              />

              {/* Content Textarea */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Dump everything here. Thoughts, tasks, random ideas, worries... unedited and free."
                autoFocus
                className="w-full min-h-[40vh] md:min-h-[50vh] bg-transparent border-none outline-none resize-none font-sans text-base sm:text-lg text-charcoal placeholder:text-muted/40 placeholder:font-serif leading-relaxed"
              />

              {/* Footer Reading & Auto-save Stats Bar */}
              <div className="pt-4 border-t border-broken-white/60 flex flex-wrap items-center justify-between gap-4 text-xs text-muted">
                <div className="flex items-center gap-4">
                  <span>{wordCount} words</span>
                  <span>•</span>
                  <span>{content.length} characters</span>
                  <span>•</span>
                  <span>~{readTime} min read</span>
                </div>

                {lastSavedTime && (
                  <div className="flex items-center gap-1.5 text-sage-dark font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Draft auto-saved at {lastSavedTime}</span>
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
