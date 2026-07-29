export type Language = "en" | "id";

export interface Translations {
  navbar: {
    dashboard: string;
    archive: string;
    recentReflectionsNav: string;
    modes: string;
    subtitle: string;
    signIn: string;
    getStarted: string;
    write: string;
    themeLight: string;
    themeDark: string;
  };
  dashboard: {
    greetingLateNight: string;
    greetingMorning: string;
    greetingAfternoon: string;
    greetingEvening: string;
    greetingNightOwl: string;
    entriesCountOne: string;
    entriesCountMany: string;
    archiveButton: string;
    recentReflectionsTitle: string;
    viewAll: string;
    noEntriesYet: string;
    burnedTag: string;
  };
  moodTracker: {
    subtitleTag: string;
    title: string;
    description: string;
    moods: {
      peaceful: string;
      grateful: string;
      anxious: string;
      reflective: string;
      low: string;
      energetic: string;
    };
  };
  modes: {
    subtitleTag: string;
    title: string;
    gratitudeLabel: string;
    gratitudePrompt: string;
    ventLabel: string;
    ventPrompt: string;
    breatheLabel: string;
    breathePrompt: string;
    visionsLabel: string;
    visionsPrompt: string;
    braindumpLabel: string;
    braindumpPrompt: string;
  };
  archive: {
    title: string;
    subtitle: string;
    entriesCountOne: string;
    entriesCountMany: string;
    searchPlaceholder: string;
    allModes: string;
    noEntriesFoundTitle: string;
    noEntriesFoundSearch: string;
    noEntriesFoundMode: string;
    writeFirstEntry: string;
    burnedTag: string;
    deleteEntry: string;
    closeNote: string;
    burnedMemory: string;
    journalReflection: string;
  };
  landing: {
    safeSpaceTag: string;
    heroTitlePart1: string;
    heroTitlePart2: string;
    startJournaling: string;
    alreadyHaveAccount: string;
    footerNotice: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    navbar: {
      dashboard: "Dashboard",
      archive: "Archive",
      recentReflectionsNav: "Recent Reflections",
      modes: "MODES:",
      subtitle: "A Safe Space for Your Mind",
      signIn: "Sign in",
      getStarted: "Get Started",
      write: "Reflections",
      themeLight: "Light Mode",
      themeDark: "Dark Mode",
    },
    dashboard: {
      greetingLateNight: "Late night thoughts?",
      greetingMorning: "Good morning",
      greetingAfternoon: "Good afternoon",
      greetingEvening: "Good evening",
      greetingNightOwl: "Night owl mode",
      entriesCountOne: "entry",
      entriesCountMany: "entries",
      archiveButton: "View Archive",
      recentReflectionsTitle: "Recent Reflections",
      viewAll: "View All",
      noEntriesYet: "No journal entries yet. Pick a mode below to write your first note!",
      burnedTag: "burned",
    },
    moodTracker: {
      subtitleTag: "Daily Check-in",
      title: "How are you feeling today?",
      description: "Select your current state of mind",
      moods: {
        peaceful: "Peaceful",
        grateful: "Grateful",
        anxious: "Anxious",
        reflective: "Reflective",
        low: "Low",
        energetic: "Energetic",
      },
    },
    modes: {
      subtitleTag: "Modes",
      title: "Choose your space",
      gratitudeLabel: "Gratitude",
      gratitudePrompt: "What are 3 small things that made you smile today?",
      ventLabel: "Vent",
      ventPrompt: "Let it out. No filters needed.",
      breatheLabel: "Breathe",
      breathePrompt: "Let's take a breath. What's on your mind?",
      visionsLabel: "Visions",
      visionsPrompt: "What is one small step for your future today?",
      braindumpLabel: "Brain Dump",
      braindumpPrompt: "A blank canvas to pour out your thoughts.",
    },
    archive: {
      title: "Recent Reflections & Memory Vault",
      subtitle: "Browse all your past reflections, releases, and gratitude notes in one place.",
      entriesCountOne: "entry",
      entriesCountMany: "entries",
      searchPlaceholder: "Search thoughts, reflections, or keywords...",
      allModes: "All Modes",
      noEntriesFoundTitle: "No reflections found",
      noEntriesFoundSearch: "Try searching for a different keyword or change your mode filter.",
      noEntriesFoundMode: "You haven't written any journal entries in this mode yet.",
      writeFirstEntry: "Write your first reflection",
      burnedTag: "Burned",
      deleteEntry: "Delete Entry",
      closeNote: "Close Note",
      burnedMemory: "Burned Memory",
      journalReflection: "Journal Reflection",
    },
    landing: {
      safeSpaceTag: "A safe space for your thoughts",
      heroTitlePart1: "Journal with",
      heroTitlePart2: "intention",
      startJournaling: "Start Journaling",
      alreadyHaveAccount: "I already have an account",
      footerNotice: "Your entries are private, encrypted, and only yours. Always.",
    },
  },
  id: {
    navbar: {
      dashboard: "Dashboard",
      archive: "Arsip",
      recentReflectionsNav: "Refleksi Terkini",
      modes: "MODE:",
      subtitle: "Ruang Aman untuk Pikiranmu",
      signIn: "Masuk",
      getStarted: "Mulai Sekarang",
      write: "Refleksi",
      themeLight: "Mode Terang",
      themeDark: "Mode Gelap",
    },
    dashboard: {
      greetingLateNight: "Pikiran larut malam?",
      greetingMorning: "Selamat pagi",
      greetingAfternoon: "Selamat siang",
      greetingEvening: "Selamat sore",
      greetingNightOwl: "Mode kalong malam",
      entriesCountOne: "catatan",
      entriesCountMany: "catatan",
      archiveButton: "Lihat Arsip",
      recentReflectionsTitle: "Refleksi Terkini",
      viewAll: "Lihat Semua",
      noEntriesYet: "Belum ada catatan jurnal. Pilih mode di bawah untuk menulis catatan pertamamu!",
      burnedTag: "dilepaskan",
    },
    moodTracker: {
      subtitleTag: "Check-in Harian",
      title: "Bagaimana perasaanmu hari ini?",
      description: "Pilih suasana hatimu saat ini",
      moods: {
        peaceful: "Damai",
        grateful: "Bersyukur",
        anxious: "Cemas",
        reflective: "Reflektif",
        low: "Sedih",
        energetic: "Berenergi",
      },
    },
    modes: {
      subtitleTag: "Mode Jurnal",
      title: "Pilih ruang renunganmu",
      gratitudeLabel: "Gratitude",
      gratitudePrompt: "Apa 3 hal kecil yang membuatmu tersenyum hari ini?",
      ventLabel: "Vent",
      ventPrompt: "Luapkan segalanya. Tanpa perlu filter.",
      breatheLabel: "Breathe",
      breathePrompt: "Tarik napas sejenak. Apa yang sedang kamu pikirkan?",
      visionsLabel: "Visions",
      visionsPrompt: "Apa satu langkah kecil untuk masa depanmu hari ini?",
      braindumpLabel: "Brain Dump",
      braindumpPrompt: "Kanvas kosong untuk membuang semua isi pikiranmu.",
    },
    archive: {
      title: "Refleksi Terkini & Brankas Kenangan",
      subtitle: "Jelajahi seluruh riwayat refleksi, luapan perasaan, dan catatan rasa syukurmu di satu tempat.",
      entriesCountOne: "catatan",
      entriesCountMany: "catatan",
      searchPlaceholder: "Cari ide, refleksi, atau kata kunci...",
      allModes: "Semua Mode",
      noEntriesFoundTitle: "Refleksi tidak ditemukan",
      noEntriesFoundSearch: "Coba cari dengan kata kunci lain atau ubah filter mode.",
      noEntriesFoundMode: "Kamu belum pernah menulis catatan jurnal di mode ini.",
      writeFirstEntry: "Tulis refleksi pertamamu",
      burnedTag: "Dilepaskan",
      deleteEntry: "Hapus Catatan",
      closeNote: "Tutup Catatan",
      burnedMemory: "Kenangan Dilepaskan",
      journalReflection: "Refleksi Jurnal",
    },
    landing: {
      safeSpaceTag: "Ruang aman untuk pikiranmu",
      heroTitlePart1: "Menulislah dengan",
      heroTitlePart2: "ketenangan",
      startJournaling: "Mulai Menulis",
      alreadyHaveAccount: "Saya sudah punya akun",
      footerNotice: "Catatanmu bersifat pribadi, terenkripsi, dan sepenuhnya milikmu. Selalu.",
    },
  },
};
