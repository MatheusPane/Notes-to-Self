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

// ── Entry Actions ──

export async function createEntry(data: {
  mode: string;
  content: string;
  title?: string;
  burned?: boolean;
}) {
  const userId = await getAuthUserId();
  await ensureUser(userId);

  const entry = await prisma.entry.create({
    data: {
      userId,
      mode: data.mode,
      content: data.content,
      title: data.title ?? null,
      burned: data.burned ?? false,
    },
  });

  revalidatePath("/archive");
  revalidatePath("/dashboard");
  return entry;
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
