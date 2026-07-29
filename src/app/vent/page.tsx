"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Flame, ArrowLeft, Save, Loader2, Wind } from "lucide-react";
import { createEntry } from "@/app/actions/journalActions";

// ── Particle System ──

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  type: "ember" | "ash" | "smoke";
}

function EmberCanvas({ active, onComplete }: { active: boolean; onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const spawnCountRef = useRef(0);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    spawnCountRef.current = 0;
    particlesRef.current = [];

    const EMBER_COLORS = ["#ff6b35", "#ff9f1c", "#ffbe0b", "#ff4500", "#e63946"];
    const ASH_COLORS = ["#6b6b6b", "#888", "#555", "#999"];
    const SMOKE_COLORS = ["rgba(80,80,80,0.3)", "rgba(100,100,100,0.2)", "rgba(60,60,60,0.15)"];

    const spawnParticles = () => {
      const count = 8 + Math.floor(Math.random() * 12);
      for (let i = 0; i < count; i++) {
        const type = Math.random() < 0.5 ? "ember" : Math.random() < 0.6 ? "ash" : "smoke";
        const colors = type === "ember" ? EMBER_COLORS : type === "ash" ? ASH_COLORS : SMOKE_COLORS;

        particlesRef.current.push({
          id: Date.now() + i + Math.random(),
          x: Math.random() * w,
          y: h * 0.5 + Math.random() * h * 0.4,
          size: type === "smoke" ? 8 + Math.random() * 20 : 2 + Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 3,
          vy: -(1 + Math.random() * 4),
          life: 0,
          maxLife: type === "smoke" ? 100 + Math.random() * 80 : 60 + Math.random() * 60,
          type,
        });
      }
    };

    let lastSpawnTime = 0;
    const TOTAL_BURSTS = 25;

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);

      // Spawn bursts
      if (spawnCountRef.current < TOTAL_BURSTS && time - lastSpawnTime > 80) {
        spawnParticles();
        spawnCountRef.current++;
        lastSpawnTime = time;
      }

      // Update & render particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++;
        const progress = p.life / p.maxLife;
        if (progress >= 1) return false;

        p.x += p.vx + Math.sin(p.life * 0.05) * 0.5;
        p.y += p.vy;
        p.vy *= 0.99;

        const alpha = 1 - progress;

        ctx.save();
        ctx.globalAlpha = alpha;

        if (p.type === "smoke") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 + progress * 2), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else if (p.type === "ember") {
          // Glow
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else {
          // Ash
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - progress * 0.3), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        }

        ctx.restore();
        return true;
      });

      if (
        spawnCountRef.current >= TOTAL_BURSTS &&
        particlesRef.current.length === 0
      ) {
        onComplete();
        return;
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-20 pointer-events-none"
    />
  );
}

// ── Vent Page ──

export default function VentPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isBurning, setIsBurning] = useState(false);
  const [burnComplete, setBurnComplete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [burnAction, setBurnAction] = useState<"release" | "archive" | null>(null);

  const handleBurnAndRelease = useCallback(() => {
    if (!content.trim()) return;
    setBurnAction("release");
    setIsBurning(true);
  }, [content]);

  const handleBurnAndArchive = useCallback(() => {
    if (!content.trim()) return;
    setBurnAction("archive");
    setIsBurning(true);
  }, [content]);

  const handleBurnComplete = useCallback(async () => {
    setBurnComplete(true);

    if (burnAction === "archive") {
      setSaving(true);
      try {
        await createEntry({
          mode: "vent",
          content: content.trim(),
          burned: true,
        });
      } catch (err) {
        console.error("Failed to save:", err);
      } finally {
        setSaving(false);
      }
    }

    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  }, [burnAction, content, router]);

  const handleSaveQuietly = useCallback(async () => {
    if (!content.trim() || saving) return;
    setSaving(true);
    try {
      await createEntry({ mode: "vent", content: content.trim() });
      setSaved(true);
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  }, [content, saving, router]);

  return (
    <div className="min-h-screen bg-navy-dark text-gray-200 relative overflow-hidden pb-16">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-orange-500/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-orange-900/15 to-transparent" />
      </div>

      {/* Burn Particle Canvas */}
      <EmberCanvas active={isBurning} onComplete={handleBurnComplete} />

      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 glass bg-navy-dark/90 backdrop-blur-md border-b border-white/10 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors px-3 py-1.5 rounded-xl hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 shadow-xs">
              <Flame className="w-4 h-4" />
            </div>
            <span className="font-serif text-base font-bold text-gray-200">
              Vent Mode
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isBurning && !saved && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveQuietly}
                disabled={!content.trim() || saving}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-gray-200 text-sm font-medium rounded-xl disabled:opacity-30 transition-colors border border-white/10"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Quietly</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Floating Dark Paper Canvas Container (Centered) */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="bg-white/5 glass backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/10 space-y-6">
          <AnimatePresence mode="wait">
            {burnComplete ? (
              /* Post-Burn Message */
              <motion.div
                key="burned"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mb-6 text-orange-400 shadow-lg shadow-orange-500/10"
                >
                  <Wind className="w-8 h-8" />
                </motion.div>
                <h2 className="font-serif text-2xl font-bold text-gray-100 mb-2">
                  {burnAction === "release" ? "Released into Ashes." : "Burned & Archived."}
                </h2>
                <p className="text-sm text-gray-400">
                  {burnAction === "release"
                    ? "It's completely gone. Take a deep breath."
                    : "Stored safely as a memory. The weight is lifted."}
                </p>
              </motion.div>
            ) : saved ? (
              /* Save Confirmation */
              <motion.div
                key="saved"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 text-gray-200">
                  <Save className="w-7 h-7" />
                </div>
                <h2 className="font-serif text-xl font-bold text-gray-100">
                  Saved quietly to your journal.
                </h2>
                <p className="text-sm text-gray-400 mt-1">Redirecting...</p>
              </motion.div>
            ) : (
              /* Writing Area */
              <motion.div
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: isBurning ? 0 : 1 }}
                transition={{ duration: isBurning ? 0.8 : 0.5 }}
                className="space-y-6"
              >
                {/* Prompt */}
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-serif text-xl sm:text-2xl text-gray-300/90 font-medium leading-relaxed border-b border-white/10 pb-4"
                >
                  Let it out. No filters needed.
                </motion.h1>

                {/* Textarea */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write whatever you need to say, scream, or let go..."
                    className="w-full bg-transparent border-none outline-none resize-none font-sans text-base sm:text-lg text-gray-100 placeholder:text-gray-500 leading-relaxed min-h-[300px] md:min-h-[380px]"
                    autoFocus
                  />
                </motion.div>

                {/* Burn Buttons */}
                {content.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleBurnAndRelease}
                      className="w-full sm:w-auto flex-1 group flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-orange-600/25"
                    >
                      <Flame className="w-5 h-5 group-hover:animate-bounce" />
                      Burn & Release (Purge)
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleBurnAndArchive}
                      className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/15 text-gray-200 font-semibold rounded-2xl transition-all border border-white/15 shadow-sm"
                    >
                      <Flame className="w-5 h-5 text-orange-400" />
                      Burn & Archive (Keep Copy)
                    </motion.button>
                  </motion.div>
                )}

                {/* Character count */}
                <div className="pt-2 text-right">
                  <span className="text-xs text-gray-400/80">
                    {content.length} characters
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
