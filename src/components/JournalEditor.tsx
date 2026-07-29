"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createEntry } from "@/app/actions/journalActions";
import type { ModeConfig } from "@/lib/modes";

interface JournalEditorProps {
  mode: ModeConfig;
  children?: React.ReactNode;
  extraButtons?: React.ReactNode;
  onSaveOverride?: (content: string) => Promise<void>;
}

export default function JournalEditor({
  mode,
  children,
  extraButtons,
  onSaveOverride,
}: JournalEditorProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(async () => {
    if (!content.trim() || saving) return;

    setSaving(true);
    try {
      if (onSaveOverride) {
        await onSaveOverride(content);
      } else {
        await createEntry({ mode: mode.key, content: content.trim() });
      }
      setSaved(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (err) {
      console.error("Failed to save entry:", err);
    } finally {
      setSaving(false);
    }
  }, [content, saving, mode.key, onSaveOverride, router]);

  const charCount = content.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pb-16"
    >
      {/* Top Bar */}
      <div className="sticky top-0 z-30 glass bg-cream/85 backdrop-blur-md border-b border-broken-white/80 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-charcoal transition-colors px-3 py-1.5 rounded-xl hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-xs ${mode.iconBg} ${mode.iconColor}`}>
              <mode.icon className="w-4 h-4" />
            </div>
            <span className="font-serif text-base font-bold text-navy">
              {mode.label} Mode
            </span>
          </div>

          <div className="flex items-center gap-2">
            {extraButtons}

            {!saved && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={!content.trim() || saving}
                className="flex items-center gap-2 px-5 py-2 bg-sage-dark hover:bg-sage text-white text-sm font-medium rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Note</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Floating Paper Canvas Wrapper (Centered at Optimal Reading Width) */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="bg-white/70 glass rounded-3xl p-6 sm:p-10 shadow-xl border border-broken-white/80 space-y-6">
          {/* Prompt Header */}
          {mode.prompt && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-serif text-xl sm:text-2xl text-navy/90 font-medium leading-relaxed border-b border-broken-white/60 pb-4"
            >
              {mode.prompt}
            </motion.p>
          )}

          {/* Optional Extra Widget (e.g., Breathing Orbit) */}
          {children}

          {/* Saved State Success Message */}
          {saved ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mb-4 text-sage-dark shadow-xs">
                <Save className="w-7 h-7" />
              </div>
              <p className="font-serif text-xl text-navy font-bold">Saved to your journal 🌿</p>
              <p className="text-sm text-muted mt-1">Redirecting to your dashboard...</p>
            </motion.div>
          ) : (
            <>
              {/* Textarea Paper Writing Area */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    mode.key === "braindump"
                      ? "Just start typing..."
                      : "Start writing your reflection..."
                  }
                  className="w-full bg-transparent border-none outline-none resize-none font-serif text-base sm:text-lg text-charcoal placeholder:text-muted/40 placeholder:font-serif placeholder:italic leading-relaxed min-h-[300px] md:min-h-[400px]"
                  autoFocus
                />
              </motion.div>

              {/* Character & Word Counter */}
              <div className="pt-4 border-t border-broken-white/60 flex items-center justify-between text-xs text-muted">
                <span>{content.trim() ? content.trim().split(/\s+/).length : 0} words</span>
                <span>
                  {charCount} {charCount === 1 ? "character" : "characters"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
