# 🌿 Notes to Self — A Safe Space for Your Thoughts

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_DB-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Clerk Auth](https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://notes-to-self-pied.vercel.app/)

> **Notes to Self** is a modern, mindful, and interactive digital journaling web application built to help users reflect, de-stress, track daily moods, and foster healthy mental habits.

🔗 **Live Application:** [https://notes-to-self-pied.vercel.app/](https://notes-to-self-pied.vercel.app/)

---

## ✨ Key Features

- 🧘 **Multi-Mode Journaling:**
  - **Gratitude:** Focus on positivity and daily appreciation.
  - **Vent & Burn:** A cathartic space to write down heavy thoughts and symbolically "burn" them with realistic flame animations.
  - **Breathe:** Guided breathing timer and visual exercises for quick relaxation and anxiety relief.
  - **Visions:** Set intentions, future goals, and vision board ideas.
  - **Brain Dump:** Unfiltered stream-of-consciousness writing space.
  - **Devotion:** Space for spiritual reflection and quiet devotion.

- 🎵 **Ambient Soundscape Player:**
  - Built-in audio player with relaxing background sounds (rain, forest, white noise) to enhance focus and calm.

- 📊 **Mood & Streak Tracker:**
  - Log daily emotional states (*peaceful, grateful, anxious, reflective, low, energetic*).
  - Track consecutive journaling streaks to build a consistent habit.

- 🗂️ **Smart Archive & Search:**
  - Filter entries by mode or tag.
  - Full-text search to easily retrieve past reflections.

- 🌐 **Internationalization & Custom Themes:**
  - Multi-language support (English & Bahasa Indonesia).
  - Theme switcher with serene dark and light modes.

- 🔒 **Secure & Private:**
  - Authentication powered by Clerk with user-isolated data storage via Prisma ORM and PostgreSQL.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Frontend Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling & UI:** [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React Icons](https://lucide.dev/), `canvas-confetti`
- **Database & ORM:** [PostgreSQL](https://neon.tech/) (Serverless via Neon DB) with [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [Clerk Auth](https://clerk.com/)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 📁 Folder Structure

```text
Notes to Self/
├── prisma/
│   └── schema.prisma         # Database schema (User, Entry, MoodLog)
├── public/                   # Static assets & soundscape audio files
├── src/
│   ├── app/                  # Next.js App Router (pages & server actions)
│   │   ├── actions/          # Server Actions (Journal CRUD, Moods, Streaks)
│   │   ├── archive/          # Archive & search entries
│   │   ├── braindump/        # Brain dump journaling mode
│   │   ├── breathe/          # Guided breathing exercise
│   │   ├── dashboard/        # Main user dashboard
│   │   ├── devotion/         # Devotion journaling mode
│   │   ├── gratitude/        # Gratitude journaling mode
│   │   ├── vent/             # Vent & burn journaling mode
│   │   └── visions/          # Vision board journaling mode
│   ├── components/           # Reusable UI components (Editor, Player, Navbar, etc.)
│   └── context/              # Language & Theme providers
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites

- **Node.js** (v18 or higher)
- **npm**, **pnpm**, or **yarn**
- **PostgreSQL Database** (e.g. [Neon.tech](https://neon.tech/), Supabase, or local PostgreSQL)
- **Clerk Account** for authentication API keys

### 1. Clone the Repository

```bash
git clone https://github.com/MatheusPane/Notes-to-Self.git
cd Notes-to-Self
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` or `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

# Database Connections (Neon / PostgreSQL)
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@host-direct/neondb?sslmode=require"
```

### 4. Setup Prisma Database

Generate Prisma Client and push database schema:

```bash
npx prisma generate
npx prisma db push
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

Developed with ❤️ by **[Matheus Pane](https://github.com/MatheusPane)**
