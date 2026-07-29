"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MODES } from "@/lib/modes";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function ModeSelector() {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1">
          {t.modes.subtitleTag}
        </span>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-navy">
          {t.modes.title}
        </h2>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        {MODES.map((mode) => {
          let modeLabel = mode.label;
          let modePrompt = mode.prompt;

          if (mode.key === "gratitude") {
            modeLabel = t.modes.gratitudeLabel;
            modePrompt = t.modes.gratitudePrompt;
          } else if (mode.key === "vent") {
            modeLabel = t.modes.ventLabel;
            modePrompt = t.modes.ventPrompt;
          } else if (mode.key === "breathe") {
            modeLabel = t.modes.breatheLabel;
            modePrompt = t.modes.breathePrompt;
          } else if (mode.key === "visions") {
            modeLabel = t.modes.visionsLabel;
            modePrompt = t.modes.visionsPrompt;
          } else if (mode.key === "braindump") {
            modeLabel = t.modes.braindumpLabel;
            modePrompt = t.modes.braindumpPrompt;
          }

          return (
            <motion.div key={mode.key} variants={item} className="h-full">
              <Link href={mode.href} className="block group h-full">
                <div
                  className={`h-full min-h-[150px] flex flex-col justify-between rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-md ${mode.cardBg} ${mode.cardBorder}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${mode.iconBg} ${mode.iconColor}`}
                      >
                        <mode.icon className="w-5 h-5" />
                      </div>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/70 shadow-xs">
                        <ArrowRight className={`w-4 h-4 ${mode.iconColor}`} />
                      </div>
                    </div>

                    <h3 className="font-serif text-base font-bold text-navy mb-1">
                      {modeLabel}
                    </h3>

                    <p className="font-sans text-sm text-muted leading-relaxed line-clamp-2">
                      {modePrompt}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
