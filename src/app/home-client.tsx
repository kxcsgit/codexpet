"use client";

import { PetCard } from "@/shared/components/pet-card";
import Link from "next/link";
import { useState } from "react";
import type { Pet } from "@/shared/lib/pets";

interface HomePageProps {
  pets: Pet[];
  categoryCount: number;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      aria-label="Copy command"
      onClick={handleCopy}
      className="group inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/76 px-3 py-2 text-left text-[12px] text-[#1a1d2e] backdrop-blur transition hover:border-[#6478f6]/40 hover:bg-white mt-5 w-full max-w-sm"
      style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
    >
      <span className="select-none text-[#3847f5]/60">$ </span>
      <span className="flex-1 truncate">
        <span className="font-medium text-[#3847f5]">npx</span>{" "}
        <span className="font-medium text-[#1a1d2e]">codexpet</span>{" "}
        <span className="text-stone-700">browse</span>
      </span>
      <span className="grid size-6 shrink-0 place-items-center rounded-md text-stone-500 transition group-hover:bg-[#eef1ff] group-hover:text-[#3847f5]">
        {copied ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        )}
      </span>
    </button>
  );
}

export function HomePageClient({ pets, categoryCount }: HomePageProps) {
  const featured = pets.filter((p) => p.featured);
  const totalPets = pets.length;

  return (
    <>
      {/* Hero */}
      <section className="petdex-cloud relative overflow-hidden">
        <div className="relative mx-auto flex w-full max-w-7xl flex-col px-5 pt-5 pb-10 md:px-8">
          <div className="mt-12 flex flex-col items-center text-center md:mt-16">
            <p className="font-mono text-xs tracking-[0.22em] text-[#5266ea] uppercase">
              The desktop pet index
            </p>
            <h1 className="mt-3 text-[48px] leading-[0.98] font-semibold tracking-tight md:text-[80px]">
              CodexPet
            </h1>
            <p className="mt-5 max-w-xl text-balance text-base leading-7 text-[#202127] md:text-lg">
              The public gallery of animated pixel pets for the{" "}
              <strong>Codex CLI</strong>. Browse {totalPets}+ open-source
              companions, preview their states, and install one with a single
              command.
            </p>
            <CopyButton text="npx codexpet browse" />
          </div>

          {/* Featured pets showcase */}
          {featured.length > 0 && (
            <div className="mt-10 flex flex-wrap items-end justify-center gap-3 md:gap-5">
              {featured.slice(0, 5).map((pet, i) => (
                <Link
                  key={pet.slug}
                  href={`/pets/${pet.slug}`}
                  aria-label={`Open ${pet.name}`}
                  className={`group relative flex flex-col items-center rounded-2xl border border-white/70 bg-white/55 px-3 pt-3 pb-2 shadow-lg shadow-blue-900/10 backdrop-blur-md transition hover:-translate-y-1 hover:bg-white ${
                    i % 2 === 0 ? "rotate-[-3deg] -translate-y-1" : "rotate-[3deg] translate-y-1"
                  }`}
                >
                  <div
                    className="pet-sprite-frame"
                    style={{ "--pet-scale": "0.55" } as React.CSSProperties}
                  >
                    <div
                      className="pet-sprite"
                      role="img"
                      aria-label={`${pet.name} animated`}
                      style={{
                        "--sprite-url": `url(${pet.image})`,
                        "--sprite-row": String(i % 8),
                        "--sprite-frames": "6",
                        "--sprite-duration": "1.1s",
                      } as React.CSSProperties}
                    />
                  </div>
                  <span className="mt-1 font-mono text-[10px] tracking-[0.18em] text-stone-700 uppercase">
                    {pet.name}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* CTA buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#gallery"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-medium text-white transition hover:bg-black/85"
            >
              Browse gallery
            </a>
            <Link
              href="/submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 px-6 text-sm font-medium text-black backdrop-blur transition hover:bg-white"
            >
              Submit a pet
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section
        id="gallery"
        className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-5 py-12 md:px-8 md:py-16"
      >
        <section className="space-y-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-xs tracking-[0.18em] text-[#6478f6] uppercase">
                Gallery — {totalPets} pets
              </p>
              <h2 className="mt-2 text-3xl font-medium tracking-tight text-black md:text-5xl">
                Pick a companion
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {pets.map((pet) => (
              <PetCard
                key={pet.slug}
                slug={pet.slug}
                name={pet.name}
                description={pet.description}
                category={pet.category}
                platform={pet.platform}
                image={pet.image}
                featured={pet.featured}
                tags={pet.tags}
                kind={pet.kind}
              />
            ))}
          </div>
        </section>
      </section>
    </>
  );
}
