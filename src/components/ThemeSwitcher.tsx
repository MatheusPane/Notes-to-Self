"use client";

import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const isDark = theme === "dark";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggleTheme}
      title={isDark ? t.navbar.themeLight : t.navbar.themeDark}
      aria-label={isDark ? t.navbar.themeLight : t.navbar.themeDark}
      className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-white/70 dark:bg-slate-800/80 backdrop-blur-md border border-broken-white/80 dark:border-slate-700/70 text-charcoal dark:text-amber-300 shadow-xs hover:border-sand dark:hover:border-slate-600 transition-colors"
    >
      <motion.div
        key={theme}
        initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {isDark ? (
          <Sun className="w-4.5 h-4.5 text-amber-300 fill-amber-300/20" />
        ) : (
          <Moon className="w-4.5 h-4.5 text-navy fill-navy/10" />
        )}
      </motion.div>
    </motion.button>
  );
}
