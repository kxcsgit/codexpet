import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header, Footer } from "@/shared/components/layout";
import "./globals.css";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://codexpet.space"),
  title: {
    default: "CodexPet — Animated pixel pets for the Codex CLI",
    template: "%s | CodexPet",
  },
  description:
    "CodexPet is the public gallery of animated pixel pets for the Codex CLI. Browse open-source companions, preview their animations, and install one with a single command.",
  keywords: [
    "codex pet",
    "codex CLI pet",
    "pixel pet",
    "animated pet",
    "developer mascot",
    "terminal pet",
    "desktop pet",
    "shimeji",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CodexPet",
    title: "CodexPet — Animated pixel pets for the Codex CLI",
    description:
      "Browse open-source companions, preview their animations, and install one with a single command.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodexPet — Animated pixel pets for the Codex CLI",
    description:
      "Browse open-source companions, preview their animations, and install one with a single command.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        geistSans.variable,
        geistMono.variable
      )}
    >
      <body className="min-h-full flex flex-col bg-[#f7f8ff] text-[#050505]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
