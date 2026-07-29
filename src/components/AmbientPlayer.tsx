"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, CloudRain, Coffee, Flame, X } from "lucide-react";

type SoundType = "rain" | "cafe" | "fireplace";

interface SoundOption {
  key: SoundType;
  label: string;
  icon: typeof CloudRain;
}

const SOUNDS: SoundOption[] = [
  { key: "rain", label: "Rain", icon: CloudRain },
  { key: "cafe", label: "Café", icon: Coffee },
  { key: "fireplace", label: "Fireplace", icon: Flame },
];

// Web Audio API based ambient sound generator
function createNoiseGenerator(
  ctx: AudioContext,
  type: SoundType,
  gainNode: GainNode
) {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();

  switch (type) {
    case "rain":
      filter.type = "bandpass";
      filter.frequency.value = 800;
      filter.Q.value = 0.5;
      break;
    case "cafe":
      filter.type = "lowpass";
      filter.frequency.value = 2000;
      filter.Q.value = 0.3;
      break;
    case "fireplace":
      filter.type = "lowpass";
      filter.frequency.value = 400;
      filter.Q.value = 1.0;
      break;
  }

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  return source;
}

export default function AmbientPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSound, setActiveSound] = useState<SoundType | null>(null);
  const [volume, setVolume] = useState(0.3);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const stopSound = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch {
        // already stopped
      }
      sourceRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const playSound = useCallback(
    (type: SoundType) => {
      stopSound();

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }

      const ctx = audioCtxRef.current;

      if (ctx.state === "suspended") {
        ctx.resume();
      }

      if (!gainRef.current) {
        gainRef.current = ctx.createGain();
      }

      gainRef.current.gain.value = volume;

      const source = createNoiseGenerator(ctx, type, gainRef.current);
      source.start();
      sourceRef.current = source;
      setActiveSound(type);
      setIsPlaying(true);
    },
    [volume, stopSound]
  );

  // Update volume
  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = volume;
    }
  }, [volume]);

  // Cleanup
  useEffect(() => {
    return () => {
      stopSound();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, [stopSound]);

  const handleSoundToggle = (type: SoundType) => {
    if (activeSound === type && isPlaying) {
      stopSound();
      setActiveSound(null);
    } else {
      playSound(type);
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-60 p-4 rounded-3xl bg-cream/95 glass border border-broken-white shadow-2xl space-y-3"
          >
            <div className="flex items-center justify-between border-b border-broken-white pb-2">
              <span className="text-[11px] font-bold text-navy uppercase tracking-wider">
                Ambient Soundscape
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted hover:text-charcoal p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              {SOUNDS.map((sound) => {
                const isActive = activeSound === sound.key && isPlaying;
                return (
                  <button
                    key={sound.key}
                    onClick={() => handleSoundToggle(sound.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-sage-dark text-white shadow-xs"
                        : "text-charcoal hover:bg-white/60"
                    }`}
                  >
                    <sound.icon className="w-4 h-4" />
                    <span>{sound.label}</span>
                    {isActive && (
                      <motion.div
                        className="ml-auto flex gap-1 items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-0.5 bg-white rounded-full"
                            animate={{ height: [4, 12, 4] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.8,
                              delay: i * 0.15,
                            }}
                          />
                        ))}
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Volume Control */}
            <div className="pt-2 border-t border-broken-white flex items-center gap-2">
              <VolumeX className="w-3.5 h-3.5 text-muted" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 h-1 accent-sage-dark cursor-pointer rounded-lg"
              />
              <Volume2 className="w-3.5 h-3.5 text-sage-dark" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Widget Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-13 h-13 rounded-full flex items-center justify-center shadow-xl transition-all ${
          isPlaying
            ? "bg-sage-dark text-white ring-4 ring-sage/30 animate-pulse"
            : "bg-white/90 glass border border-broken-white text-muted hover:text-navy"
        }`}
      >
        <Volume2 className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
