import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getEntries } from "@/app/actions/journalActions";
import ArchiveClient, { ArchiveEntry } from "./ArchiveClient";

export default async function ArchivePage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  let entries: ArchiveEntry[] = [];
  try {
    const rawEntries = (await getEntries()) as Array<{
      id: string;
      mode: string;
      title: string | null;
      content: string;
      burned: boolean;
      createdAt: Date;
    }>;
    entries = rawEntries.map((e) => ({
      id: e.id,
      mode: e.mode,
      title: e.title,
      content: e.content,
      burned: e.burned,
      createdAt: e.createdAt.toISOString(),
    }));
  } catch {
    // Database fallback or empty array if uninitialized
    entries = [];
  }

  return <ArchiveClient initialEntries={entries} />;
}
