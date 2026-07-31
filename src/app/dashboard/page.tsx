import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import {
  getTodayMood,
  getRecentEntries,
  getEntryCount,
  getUserStreak,
} from "@/app/actions/journalActions";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  let todayMood = null;
  let recentEntries: Array<{
    id: string;
    mode: string;
    content: string;
    createdAt: Date;
    burned: boolean;
  }> = [];
  let entryCount = 0;
  let currentStreak = 0;

  try {
    todayMood = await getTodayMood();
    recentEntries = await getRecentEntries(4);
    entryCount = await getEntryCount();
    currentStreak = await getUserStreak();
  } catch {
    // DB not yet migrated – render empty state
  }

  return (
    <DashboardClient
      userName={user.firstName ?? "Friend"}
      todayMood={todayMood?.mood ?? null}
      recentEntries={recentEntries.map((e) => ({
        id: e.id,
        mode: e.mode,
        content: e.content,
        createdAt: e.createdAt.toISOString(),
        burned: e.burned,
      }))}
      entryCount={entryCount}
      currentStreak={currentStreak}
    />
  );
}
