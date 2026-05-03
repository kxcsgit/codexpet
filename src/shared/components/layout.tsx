"use client";

import Link from "next/link";
import { useState } from "react";

function PetdexLogo() {
  return (
    <svg
      aria-hidden="true"
      className="size-9"
      fill="none"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="petdex-body"
          x1="8"
          y1="8"
          x2="56"
          y2="56"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3847f5" />
          <stop offset="1" stopColor="#1a1d2e" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#petdex-body)" />
      <g fill="#ffffff">
        <rect x="22" y="20" width="6" height="6" />
        <rect x="36" y="20" width="6" height="6" />
        <rect x="16" y="26" width="6" height="18" />
        <rect x="42" y="26" width="6" height="18" />
        <rect x="22" y="38" width="20" height="6" />
      </g>
    </svg>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <nav className="flex items-center justify-between gap-3 px-5 py-4 md:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-black"
          aria-label="CodexPet home"
        >
          <PetdexLogo />
          <span className="text-xl font-semibold tracking-normal">
            CodexPet
          </span>
        </Link>

        <div className="hidden items-center gap-9 text-sm text-[#4f515c] md:flex">
          <Link href="/#gallery" className="transition hover:text-black">
            Gallery
          </Link>
          <Link href="/submit" className="transition hover:text-black">
            Submit
          </Link>
          <a
            href="https://github.com/kxcsgit/codexpet"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition hover:text-black"
          >
            <svg
              aria-hidden="true"
              className="size-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.27-.01-1.16-.02-2.1-3.2.7-3.88-1.36-3.88-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.96 10.96 0 0 1 5.74 0c2.18-1.49 3.14-1.18 3.14-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
            </svg>
            GitHub
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/submit"
            className="hidden h-10 items-center justify-center rounded-full bg-black px-4 text-sm font-medium text-white transition hover:bg-black/85 md:inline-flex"
          >
            Submit a pet
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="grid size-10 place-items-center rounded-full border border-black/10 bg-white/70 text-stone-700 transition hover:bg-white md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d="M4 5h16" />
              <path d="M4 12h16" />
              <path d="M4 19h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-black/5 bg-white/90 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1 px-5 py-3">
            <Link
              href="/#gallery"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-[#4f515c] transition hover:bg-black/5 hover:text-black"
            >
              Gallery
            </Link>
            <Link
              href="/submit"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-[#4f515c] transition hover:bg-black/5 hover:text-black"
            >
              Submit
            </Link>
            <a
              href="https://github.com/kxcsgit/codexpet"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg px-3 py-2 text-sm text-[#4f515c] transition hover:bg-black/5 hover:text-black"
            >
              GitHub
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-7xl px-5 py-10 md:px-8">
      <div className="flex flex-col items-start justify-between gap-3 border-t border-black/10 pt-6 text-xs text-stone-500 md:flex-row md:items-center">
        <p>Pets are community-submitted. CodexPet does not claim rights to any underlying IP.</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/submit"
            className="underline underline-offset-4 transition hover:text-black"
          >
            Submit
          </Link>
          <a
            href="https://github.com/kxcsgit/codexpet"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 transition hover:text-black"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
