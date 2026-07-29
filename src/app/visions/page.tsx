"use client";

import { MODES } from "@/lib/modes";
import JournalEditor from "@/components/JournalEditor";

export default function VisionsPage() {
  const mode = MODES.find((m) => m.key === "visions")!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-lilac-light via-cream to-white">
      {/* Ambient floating circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 right-1/5 w-64 h-64 rounded-full bg-lilac/15 blur-[80px] animate-drift" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-lilac-light/20 blur-[60px] animate-drift" />
      </div>

      <JournalEditor mode={mode} />
    </div>
  );
}
