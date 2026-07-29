"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MODES } from "@/lib/modes";
import JournalEditor from "@/components/JournalEditor";

// Box Breathing: Inhale 4s, Hold 4s, Exhale 4s, Hold 4s = 16s cycle
const PHASES = [
  { label: "Inhale", duration: 4 },
  { label: "Hold", duration: 4 },
  { label: "Exhale", duration: 4 },
  { label: "Hold", duration: 4 },
];

function BreathingWidget() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [counter, setCounter] = useState(4);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          setPhaseIndex((pi) => (pi + 1) % 4);
          return PHASES[(phaseIndex + 1) % 4].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phaseIndex]);

  const phase = PHASES[phaseIndex];
  const scale = phase.label === "Inhale" ? 1.4 : phase.label === "Exhale" ? 1 : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="flex flex-col items-center mb-10"
    >
      <div className="relative flex items-center justify-center mb-6">
        {/* Breathing circle */}
        <motion.div
          animate={
            isActive
              ? {
                  scale: scale ?? 1.2,
                  opacity: phase.label.includes("Hold") ? 0.8 : 1,
                }
              : {}
          }
          transition={{ duration: phase.duration, ease: "easeInOut" }}
          className="w-32 h-32 rounded-full bg-sage/20 border-2 border-sage/30 flex items-center justify-center"
        >
          <div className="text-center">
            <p className="font-serif text-lg text-sage-dark font-semibold">
              {isActive ? phase.label : "Ready?"}
            </p>
            {isActive && (
              <p className="text-2xl font-bold text-sage-dark mt-1">{counter}</p>
            )}
          </div>
        </motion.div>

        {/* Orbiting dot */}
        {isActive && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            className="absolute w-32 h-32"
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-sage-dark shadow-md" />
          </motion.div>
        )}
      </div>

      <button
        onClick={() => {
          setIsActive(!isActive);
          if (!isActive) {
            setPhaseIndex(0);
            setCounter(4);
          }
        }}
        className="text-sm font-medium text-sage-dark hover:text-sage transition-colors px-4 py-2 rounded-xl bg-sage/10 hover:bg-sage/20"
      >
        {isActive ? "Stop" : "Start Breathing Exercise"}
      </button>
    </motion.div>
  );
}

export default function BreathePage() {
  const mode = MODES.find((m) => m.key === "breathe")!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-light via-cream to-sky-light/30">
      <JournalEditor mode={mode}>
        <BreathingWidget />
      </JournalEditor>
    </div>
  );
}
