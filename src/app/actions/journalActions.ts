"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ── Helpers ──

async function getAuthUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

async function ensureUser(userId: string) {
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
  });
}

/**
 * Calculates calendar day difference between two dates,
 * ignoring time of day.
 */
function getCalendarDayDifference(dateA: Date, dateB: Date): number {
  const dayA = new Date(dateA.getFullYear(), dateA.getMonth(), dateA.getDate());
  const dayB = new Date(dateB.getFullYear(), dateB.getMonth(), dateB.getDate());
  const diffMs = dayA.getTime() - dayB.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

// ── Entry Actions ──

export async function createEntry(data: {
  mode: string;
  content: string;
  title?: string;
  burned?: boolean;
}) {
  const userId = await getAuthUserId();
  await ensureUser(userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currentStreak: true, lastEntryDate: true },
  });

  const now = new Date();
  let newStreak = 1;

  if (user?.lastEntryDate) {
    const diffDays = getCalendarDayDifference(now, user.lastEntryDate);
    if (diffDays === 0) {
      // Entry saved today: streak remains unchanged
      newStreak = Math.max(user.currentStreak, 1);
    } else if (diffDays === 1) {
      // Last entry was yesterday: increment streak
      newStreak = user.currentStreak + 1;
    } else {
      // Last entry was older than yesterday: reset streak to 1
      newStreak = 1;
    }
  } else {
    // First entry ever: set streak to 1
    newStreak = 1;
  }

  const entry = await prisma.entry.create({
    data: {
      userId,
      mode: data.mode,
      content: data.content,
      title: data.title ?? null,
      burned: data.burned ?? false,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      currentStreak: newStreak,
      lastEntryDate: now,
    },
  });

  revalidatePath("/archive");
  revalidatePath("/dashboard");
  return entry;
}

export async function getUserStreak(): Promise<number> {
  const userId = await getAuthUserId();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currentStreak: true, lastEntryDate: true },
  });

  if (!user || !user.lastEntryDate) return 0;

  const now = new Date();
  const diffDays = getCalendarDayDifference(now, user.lastEntryDate);

  // If last entry was today (0) or yesterday (1), currentStreak is active.
  if (diffDays <= 1) {
    return user.currentStreak;
  }

  return 0;
}

export async function getEntries(mode?: string) {
  const userId = await getAuthUserId();

  const entries = await prisma.entry.findMany({
    where: {
      userId,
      ...(mode ? { mode } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return entries;
}

export async function getRecentEntries(limit: number = 5) {
  const userId = await getAuthUserId();

  return prisma.entry.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function deleteEntry(id: string) {
  const userId = await getAuthUserId();

  await prisma.entry.deleteMany({
    where: { id, userId },
  });

  revalidatePath("/archive");
  revalidatePath("/dashboard");
}

// ── Mood Actions ──

export async function logMood(mood: string, note?: string) {
  const userId = await getAuthUserId();
  await ensureUser(userId);

  const log = await prisma.moodLog.create({
    data: { userId, mood, note },
  });

  revalidatePath("/dashboard");
  return log;
}

export async function getTodayMood() {
  const userId = await getAuthUserId();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  return prisma.moodLog.findFirst({
    where: {
      userId,
      createdAt: { gte: startOfDay },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getEntryCount() {
  const userId = await getAuthUserId();
  return prisma.entry.count({ where: { userId } });
}
