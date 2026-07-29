"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MOODS, type MoodKey } from "@/lib/modes";
import { logMood } from "@/app/actions/journalActions";
import { Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface MoodTrackerProps {
  initialMood?: string | null;
}

export default function MoodTracker({ initialMood }: MoodTrackerProps) {
  const { t } = useLanguage();
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(
    (initialMood as MoodKey) ?? null
  );
  const [saving, setSaving] = useState(false);

  const handleSelectMood = async (mood: MoodKey) => {
    if (saving) return;
    setSelectedMood(mood);
    setSaving(true);
    try {
      await logMood(mood);
    } catch (err) {
      console.error("Failed to log mood:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-cream/60 glass border border-broken-white/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1">
          {t.moodTracker.subtitleTag}
        </span>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-navy">
          {t.moodTracker.title}
        </h2>
        <p className="font-sans text-sm text-muted mt-0.5">
          {t.moodTracker.description}
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {MOODS.map((mood) => {
          const isSelected = selectedMood === mood.key;
          const moodLabel =
            t.moodTracker.moods[mood.key as keyof typeof t.moodTracker.moods] ??
            mood.label;

          return (
            <motion.button
              key={mood.key}
              whileHover={{ scale: isSelected ? 1.05 : 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectMood(mood.key)}
              className={`relative flex flex-col items-center justify-center gap-2 p-3.5 sm:p-4 rounded-2xl transition-all duration-200 cursor-pointer ${
                isSelected
                  ? `border-2 ${mood.accentBorder} ${mood.accentBg} shadow-md ${mood.accentText} scale-105 font-bold`
                  : "bg-white/70 border border-broken-white/80 text-charcoal hover:bg-white hover:border-sand/50 shadow-xs"
              }`}
            >
              <span className="text-3xl">
                {mood.emoji}
              </span>
              <span className="font-sans text-xs font-semibold">
                {moodLabel}
              </span>

              {isSelected && (
                <motion.div
                  layoutId="mood-check"
                  className={`absolute -top-1.5 -right-1.5 w-5 h-5 ${mood.badgeBg} text-white rounded-full flex items-center justify-center shadow-xs`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.3 }}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
