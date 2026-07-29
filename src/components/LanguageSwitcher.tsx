"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative flex items-center p-1 bg-white/70 backdrop-blur-md rounded-xl border border-broken-white/80 shadow-xs">
      <Globe className="w-3.5 h-3.5 text-muted ml-1.5 mr-1" />
      <div className="relative flex items-center gap-0.5">
        <button
          onClick={() => setLanguage("id")}
          className={`relative z-10 px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
            language === "id" ? "text-navy" : "text-muted hover:text-charcoal"
          }`}
        >
          ID
        </button>
        <button
          onClick={() => setLanguage("en")}
          className={`relative z-10 px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
            language === "en" ? "text-navy" : "text-muted hover:text-charcoal"
          }`}
        >
          EN
        </button>

        <motion.div
          className="absolute inset-0 z-0 bg-sage/25 rounded-lg border border-sage/30"
          initial={false}
          animate={{
            x: language === "id" ? 0 : "100%",
            width: "50%",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      </div>
    </div>
  );
}
