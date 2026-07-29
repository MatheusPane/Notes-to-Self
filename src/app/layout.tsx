import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Playfair_Display } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Notes to Self — A Safe Space for Your Thoughts",
  description:
    "A calming, emotion-based journaling platform. Gratitude, venting, breathing, visions, and brain dumps — all in one beautiful, private space.",
  keywords: ["journal", "mental health", "gratitude", "mindfulness", "self-care"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#7a8c72",
          colorBackground: "#faf8f5",
          borderRadius: "0.75rem",
          fontFamily: `"Inter", system-ui, sans-serif`,
        },
        elements: {
          formButtonPrimary:
            "bg-sage-dark hover:bg-sage text-white shadow-none",
          card: "shadow-lg border border-broken-white",
          headerTitle: "font-serif text-navy",
          headerSubtitle: "text-muted",
        },
      }}
    >
      <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
        <body className="font-sans antialiased bg-cream text-charcoal min-h-screen">
          <ThemeProvider>
            <LanguageProvider>{children}</LanguageProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
