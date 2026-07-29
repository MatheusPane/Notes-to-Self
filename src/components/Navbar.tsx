"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  BookOpen,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const mainNavItems = [
    { href: "/dashboard", label: t.navbar.dashboard, icon: LayoutGrid },
    { href: "/archive", label: t.navbar.recentReflectionsNav, icon: Sparkles },
  ];

  return (
    <>
      {/* Top Navigation Bar (Desktop & Tablet) */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="sticky top-0 z-50 glass bg-cream/85 backdrop-blur-md border-b border-broken-white/80 shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo Brand */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-sage/25 flex items-center justify-center group-hover:bg-sage/40 transition-colors shadow-xs">
              <BookOpen className="w-5 h-5 text-sage-dark" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold text-navy tracking-tight leading-none">
                Notes to Self
              </span>
              <span className="text-xs font-semibold text-muted tracking-wider uppercase font-sans mt-0.5 hidden sm:inline-block">
                {t.navbar.subtitle}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {mainNavItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "text-navy font-semibold"
                      : "text-muted hover:text-charcoal hover:bg-broken-white/50"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-sage/15 rounded-xl border border-sage/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Tools: Language Switcher, Theme Switcher, Profile Menu */}
          <div className="flex items-center gap-2.5">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <div className="pl-2.5 border-l border-broken-white">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 shadow-xs ring-2 ring-sage/20",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Bottom Navigation Bar (Mobile only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass bg-cream/95 backdrop-blur-md border-t border-broken-white/80 px-4 py-2.5 shadow-lg">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {mainNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-1 rounded-xl text-xs font-medium transition-colors",
                  isActive ? "text-sage-dark font-bold" : "text-muted"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
