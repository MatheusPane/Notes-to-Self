"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import AmbientPlayer from "@/components/AmbientPlayer";
import { MODES } from "@/lib/modes";
import {
  Search,
  Calendar,
  Trash2,
  X,
  Flame,
  BookOpen,
  Filter,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { deleteEntry } from "@/app/actions/journalActions";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export interface ArchiveEntry {
  id: string;
  mode: string;
  title: string | null;
  content: string;
  burned: boolean;
  createdAt: string;
}

interface ArchiveClientProps {
  initialEntries: ArchiveEntry[];
}

export default function ArchiveClient({ initialEntries }: ArchiveClientProps) {
  const { language, t } = useLanguage();
  const [entries, setEntries] = useState<ArchiveEntry[]>(initialEntries);
  const [selectedMode, setSelectedMode] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<ArchiveEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesMode =
        selectedMode === "all" || entry.mode === selectedMode;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        entry.content.toLowerCase().includes(query) ||
        (entry.title && entry.title.toLowerCase().includes(query));

      return matchesMode && matchesSearch;
    });
  }, [entries, selectedMode, searchQuery]);

  const handleDelete = async (id: string) => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      setSelectedEntry(null);
    } catch (err) {
      console.error("Failed to delete entry:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream pb-16 md:pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 glass bg-white/40 p-6 rounded-3xl border border-broken-white/80 shadow-xs">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy">
              {t.archive.title}
            </h1>
            <p className="text-sm text-muted mt-1">
              {t.archive.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-sage-dark bg-sage/15 px-4 py-2 rounded-2xl border border-sage/20 font-semibold w-fit">
            <BookOpen className="w-4 h-4" />
            <span>
              {filteredEntries.length}{" "}
              {filteredEntries.length === 1
                ? t.archive.entriesCountOne
                : t.archive.entriesCountMany}
            </span>
          </div>
        </div>

        {/* Filters & Search Controls */}
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.archive.searchPlaceholder}
              className="w-full pl-11 pr-10 py-3 bg-white/80 glass border border-broken-white rounded-2xl text-sm text-charcoal placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-sage/40 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto sm:flex-wrap pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedMode("all")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedMode === "all"
                  ? "bg-navy text-white shadow-xs"
                  : "bg-white/70 text-muted hover:bg-white hover:text-charcoal border border-broken-white"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{t.archive.allModes}</span>
            </button>

            {MODES.map((mode) => {
              const Icon = mode.icon;
              const isActive = selectedMode === mode.key;

              let modeLabel = mode.label;
              if (mode.key === "gratitude") modeLabel = t.modes.gratitudeLabel;
              if (mode.key === "vent") modeLabel = t.modes.ventLabel;
              if (mode.key === "breathe") modeLabel = t.modes.breatheLabel;
              if (mode.key === "visions") modeLabel = t.modes.visionsLabel;
              if (mode.key === "braindump") modeLabel = t.modes.braindumpLabel;
              if (mode.key === "devotion") modeLabel = t.modes.devotionLabel;

              return (
                <button
                  key={mode.key}
                  onClick={() => setSelectedMode(mode.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? `${mode.activeBg} ${mode.iconColor} border ${mode.activeBorder} shadow-xs`
                      : "bg-white/70 text-muted hover:bg-white hover:text-charcoal border border-broken-white"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? mode.iconColor : ""}`} />
                  <span>{modeLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Entries Grid */}
        {filteredEntries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center glass bg-white/40 rounded-3xl border border-broken-white p-8"
          >
            <div className="w-14 h-14 rounded-full bg-sage/10 flex items-center justify-center mb-4 text-sage-dark">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-navy font-bold mb-1">
              {t.archive.noEntriesFoundTitle}
            </h3>
            <p className="text-sm font-sans text-muted max-w-sm mb-6">
              {searchQuery
                ? t.archive.noEntriesFoundSearch
                : t.archive.noEntriesFoundMode}
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy hover:bg-navy/90 text-white text-sm font-medium rounded-xl transition-colors shadow-xs"
            >
              {t.archive.writeFirstEntry}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
            {filteredEntries.map((entry, idx) => {
              const modeConfig = MODES.find((m) => m.key === entry.mode);
              const Icon = modeConfig?.icon || BookOpen;
              const date = new Date(entry.createdAt);

              let modeLabel = modeConfig?.label ?? entry.mode;
              if (entry.mode === "gratitude") modeLabel = t.modes.gratitudeLabel;
              if (entry.mode === "vent") modeLabel = t.modes.ventLabel;
              if (entry.mode === "breathe") modeLabel = t.modes.breatheLabel;
              if (entry.mode === "visions") modeLabel = t.modes.visionsLabel;
              if (entry.mode === "braindump") modeLabel = t.modes.braindumpLabel;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => setSelectedEntry(entry)}
                  className={`group relative p-5 rounded-3xl border transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${
                    modeConfig?.cardBg ?? "bg-white/80"
                  } ${modeConfig?.cardBorder ?? "border-white/50"} flex flex-col justify-between`}
                >
                  <div>
                    {/* Mode Badge & Burned Tag */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${modeConfig?.iconBg ?? "bg-white/50"}`}>
                          <Icon
                            className={`w-3.5 h-3.5 ${
                              modeConfig?.iconColor ?? "text-muted"
                            }`}
                          />
                        </div>
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${modeConfig?.badgeBg ?? "bg-white/60 text-muted"}`}>
                          {modeLabel}
                        </span>
                      </div>

                      {entry.burned && (
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 bg-red-500/15 text-red-700 rounded-full border border-red-200/80">
                          <Flame className="w-3 h-3" />
                          {t.archive.burnedTag}
                        </span>
                      )}
                    </div>

                    {/* Title if available */}
                    {entry.title && (
                      <h3 className="font-serif text-base font-bold text-navy mb-1.5 line-clamp-1">
                        {entry.title}
                      </h3>
                    )}

                    {/* Content snippet */}
                    <p className="text-sm text-charcoal/85 line-clamp-5 leading-relaxed font-sans mb-4">
                      {entry.content}
                    </p>
                  </div>

                  {/* Footer Date */}
                  <div className="flex items-center gap-1.5 text-xs text-muted/70 pt-3 border-t border-black/5 mt-auto">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {date.toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Entry Detail Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEntry(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-3xl bg-cream glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-broken-white max-h-[85vh] flex flex-col z-10"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-broken-white/80 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-sage-dark bg-sage/15 px-3 py-1 rounded-full border border-sage/20">
                      {selectedEntry.mode}
                    </span>
                    {selectedEntry.burned && (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                        <Flame className="w-3.5 h-3.5" />
                        {t.archive.burnedMemory}
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy">
                    {selectedEntry.title || t.archive.journalReflection}
                  </h2>
                  <p className="text-xs text-muted mt-1">
                    {new Date(selectedEntry.createdAt).toLocaleString(
                      language === "id" ? "id-ID" : "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedEntry(null)}
                  className="p-2 text-muted hover:text-charcoal hover:bg-white/60 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body Scrollable */}
              <div className="flex-1 overflow-y-auto pr-2 my-2 space-y-4 text-charcoal font-sans text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                {selectedEntry.content}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-broken-white/80 mt-4">
                <button
                  onClick={() => handleDelete(selectedEntry.id)}
                  disabled={isDeleting}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>{t.archive.deleteEntry}</span>
                </button>

                <button
                  onClick={() => setSelectedEntry(null)}
                  className="px-5 py-2.5 bg-navy text-white text-xs font-semibold rounded-xl hover:bg-navy/90 transition-colors shadow-xs"
                >
                  {t.archive.closeNote}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AmbientPlayer />
    </div>
  );
}
