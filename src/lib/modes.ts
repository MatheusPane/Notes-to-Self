import {
  Heart,
  Flame,
  Wind,
  Sparkles,
  Brain,
  type LucideIcon,
} from "lucide-react";

export interface ModeConfig {
  key: string;
  label: string;
  prompt: string;
  icon: LucideIcon;
  href: string;
  iconColor: string;
  iconBg: string;
  cardBg: string;
  cardBorder: string;
  badgeBg: string;
  activeBorder: string;
  activeBg: string;
  textClass: string;
  accentClass: string;
  gradientFrom: string;
  gradientTo: string;
}

export const MODES: ModeConfig[] = [
  {
    key: "gratitude",
    label: "Gratitude",
    prompt: "What are 3 small things that made you smile today?",
    icon: Heart,
    href: "/gratitude",
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/15",
    cardBg: "bg-orange-500/10 hover:bg-orange-500/15",
    cardBorder: "border-orange-200/80",
    badgeBg: "bg-orange-500/15 text-orange-800 border-orange-200/80",
    activeBorder: "border-orange-500",
    activeBg: "bg-orange-500/20",
    textClass: "text-amber-900",
    accentClass: "text-orange-500",
    gradientFrom: "from-orange-100",
    gradientTo: "to-amber-50",
  },
  {
    key: "vent",
    label: "Vent",
    prompt: "Let it out. No filters needed.",
    icon: Flame,
    href: "/vent",
    iconColor: "text-red-500",
    iconBg: "bg-red-500/15",
    cardBg: "bg-red-500/10 hover:bg-red-500/15",
    cardBorder: "border-red-200/80",
    badgeBg: "bg-red-500/15 text-red-800 border-red-200/80",
    activeBorder: "border-red-500",
    activeBg: "bg-red-500/20",
    textClass: "text-red-950",
    accentClass: "text-red-500",
    gradientFrom: "from-red-100",
    gradientTo: "to-rose-50",
  },
  {
    key: "breathe",
    label: "Breathe",
    prompt: "Let's take a breath. What's on your mind?",
    icon: Wind,
    href: "/breathe",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/15",
    cardBg: "bg-blue-500/10 hover:bg-blue-500/15",
    cardBorder: "border-blue-200/80",
    badgeBg: "bg-blue-500/15 text-blue-800 border-blue-200/80",
    activeBorder: "border-blue-500",
    activeBg: "bg-blue-500/20",
    textClass: "text-blue-950",
    accentClass: "text-blue-500",
    gradientFrom: "from-blue-100",
    gradientTo: "to-sky-50",
  },
  {
    key: "visions",
    label: "Visions",
    prompt: "What is one small step for your future today?",
    icon: Sparkles,
    href: "/visions",
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/15",
    cardBg: "bg-purple-500/10 hover:bg-purple-500/15",
    cardBorder: "border-purple-200/80",
    badgeBg: "bg-purple-500/15 text-purple-800 border-purple-200/80",
    activeBorder: "border-purple-500",
    activeBg: "bg-purple-500/20",
    textClass: "text-purple-950",
    accentClass: "text-purple-500",
    gradientFrom: "from-purple-100",
    gradientTo: "to-violet-50",
  },
  {
    key: "braindump",
    label: "Brain Dump",
    prompt: "A blank canvas to pour out your thoughts.",
    icon: Brain,
    href: "/braindump",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-500/15",
    cardBg: "bg-emerald-500/10 hover:bg-emerald-500/15",
    cardBorder: "border-emerald-200/80",
    badgeBg: "bg-emerald-500/15 text-emerald-800 border-emerald-200/80",
    activeBorder: "border-emerald-500",
    activeBg: "bg-emerald-500/20",
    textClass: "text-emerald-950",
    accentClass: "text-emerald-600",
    gradientFrom: "from-emerald-100",
    gradientTo: "to-teal-50",
  },
];

export const MOODS = [
  {
    key: "peaceful",
    label: "Peaceful",
    emoji: "🍃",
    accentBorder: "border-emerald-500",
    accentBg: "bg-emerald-500/20",
    accentText: "text-emerald-900",
    badgeBg: "bg-emerald-500",
  },
  {
    key: "grateful",
    label: "Grateful",
    emoji: "🌻",
    accentBorder: "border-orange-500",
    accentBg: "bg-orange-500/20",
    accentText: "text-orange-900",
    badgeBg: "bg-orange-500",
  },
  {
    key: "anxious",
    label: "Anxious",
    emoji: "🌊",
    accentBorder: "border-blue-500",
    accentBg: "bg-blue-500/20",
    accentText: "text-blue-900",
    badgeBg: "bg-blue-500",
  },
  {
    key: "reflective",
    label: "Reflective",
    emoji: "🌙",
    accentBorder: "border-purple-500",
    accentBg: "bg-purple-500/20",
    accentText: "text-purple-900",
    badgeBg: "bg-purple-500",
  },
  {
    key: "low",
    label: "Low",
    emoji: "☁️",
    accentBorder: "border-slate-500",
    accentBg: "bg-slate-500/20",
    accentText: "text-slate-900",
    badgeBg: "bg-slate-500",
  },
  {
    key: "energetic",
    label: "Energetic",
    emoji: "✨",
    accentBorder: "border-amber-500",
    accentBg: "bg-amber-500/20",
    accentText: "text-amber-900",
    badgeBg: "bg-amber-500",
  },
] as const;

export type MoodKey = (typeof MOODS)[number]["key"];

