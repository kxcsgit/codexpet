import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import { Header, Footer } from "@/shared/components/layout";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://codexpet.space"),
  title: {
    default: "CodexPet — Desktop Pets Directory",
    template: "%s | CodexPet",
  },
  description:
    "Discover and download the best desktop pets. From AI coding companions to classic mascots — find your perfect digital friend.",
  keywords: ["desktop pets", "shimeji", "desktop goose", "codex pet", "ai pet", "virtual pet", "screen pet"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CodexPet",
    title: "CodexPet — Desktop Pets Directory",
    description: "Discover and download the best desktop pets.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodexPet — Desktop Pets Directory",
    description: "Discover and download the best desktop pets.",
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
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${inter.className} antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
