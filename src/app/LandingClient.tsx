"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Heart, Flame, Wind, Sparkles, Brain, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const quotes = {
  en: [
    "Your thoughts are safe here.",
    "A quiet corner of the internet, just for you.",
    "Write to understand. Write to release. Write to dream.",
  ],
  id: [
    "Pikiranmu aman di sini.",
    "Sudut tenang internet, khusus untuk dirimu.",
    "Menulislah untuk memahami. Menulislah untuk melepaskan. Menulislah untuk bermimpi.",
  ],
};

export default function LandingClient() {
  const { language, t } = useLanguage();

  const currentQuotes = quotes[language];
  const quote = currentQuotes[Math.floor(Date.now() / 86400000) % currentQuotes.length];

  const features = [
    { icon: Heart, label: t.modes.gratitudeLabel, color: "text-peach-dark", bg: "bg-peach/20" },
    { icon: Flame, label: t.modes.ventLabel, color: "text-orange-500", bg: "bg-navy/10" },
    { icon: Wind, label: t.modes.breatheLabel, color: "text-sage-dark", bg: "bg-sage/20" },
    { icon: Sparkles, label: t.modes.visionsLabel, color: "text-lilac-dark", bg: "bg-lilac/20" },
    { icon: Brain, label: t.modes.braindumpLabel, color: "text-muted", bg: "bg-broken-white" },
  ];

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-4 sm:px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full"
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-sage/20 flex items-center justify-center">
            <BookOpen className="w-4.5 h-4.5 text-sage-dark" />
          </div>
          <span className="font-serif text-xl font-semibold text-navy">
            Notes to Self
          </span>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/sign-in"
            className="text-sm font-medium text-muted hover:text-charcoal transition-colors px-3 py-2"
          >
            {t.navbar.signIn}
          </Link>
          <Link
            href="/sign-up"
            className="text-sm font-medium bg-sage-dark hover:bg-sage text-white px-4 py-2 rounded-xl transition-colors"
          >
            {t.navbar.getStarted}
          </Link>
        </div>
      </motion.header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 -mt-10">
        {/* Floating ambient circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-sage/8 blur-3xl"
          />
          <motion.div
            animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-peach/8 blur-3xl"
          />
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-lilac/8 blur-3xl"
          />
        </div>

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-sm font-medium text-sage-dark mb-4 tracking-wider uppercase">
              {t.landing.safeSpaceTag}
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-navy leading-tight mb-6"
          >
            {t.landing.heroTitlePart1}
            <br />
            <span className="bg-gradient-to-r from-sage-dark via-sage to-peach-dark bg-clip-text text-transparent">
              {t.landing.heroTitlePart2}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-muted leading-relaxed mb-8 font-serif italic"
          >
            &ldquo;{quote}&rdquo;
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              href="/sign-up"
              className="group flex items-center gap-2 bg-sage-dark hover:bg-sage text-white font-medium px-6 py-3 rounded-2xl transition-all shadow-md shadow-sage/20"
            >
              {t.landing.startJournaling}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-muted hover:text-charcoal px-4 py-3 transition-colors"
            >
              {t.landing.alreadyHaveAccount}
            </Link>
          </motion.div>
        </div>

        {/* Mode Preview Chips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 mt-16 flex flex-wrap justify-center gap-2"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.08 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${f.bg} border border-white/30`}
            >
              <f.icon className={`w-3.5 h-3.5 ${f.color}`} />
              <span className="text-xs font-medium text-charcoal/70">
                {f.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-6 text-center">
        <p className="text-xs text-muted">
          {t.landing.footerNotice}
        </p>
      </footer>
    </div>
  );
}
