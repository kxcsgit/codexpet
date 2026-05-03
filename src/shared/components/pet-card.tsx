"use client";

import Link from "next/link";

interface PetCardProps {
  slug: string;
  name: string;
  description: string;
  category: string;
  platform: string[];
  image: string;
  featured?: boolean;
  tags?: string[];
  kind?: string;
}

export function PetCard({
  slug,
  name,
  description,
  category,
  image,
  featured,
  tags,
  kind,
}: PetCardProps) {
  const kindLabels: Record<string, string> = {
    creature: "creature",
    character: "character",
    object: "object",
    mascot: "mascot",
  };

  return (
    <Link
      href={`/pets/${slug}`}
      className="group relative flex flex-col items-center rounded-2xl border border-white/70 bg-white/55 px-3 pt-3 pb-4 shadow-lg shadow-blue-900/10 backdrop-blur-md transition hover:-translate-y-1 hover:bg-white"
    >
      {/* Spritesheet preview */}
      <div className="pet-sprite-frame" style={{ "--pet-scale": "0.5" } as React.CSSProperties}>
        <div
          className="pet-sprite"
          role="img"
          aria-label={`${name} animated`}
          style={{
            "--sprite-url": `url(${image})`,
            "--sprite-row": "0",
            "--sprite-frames": "6",
            "--sprite-duration": "1.1s",
          } as React.CSSProperties}
        />
      </div>

      {/* Name */}
      <span className="mt-1 font-mono text-[10px] tracking-[0.18em] text-stone-700 uppercase">
        {name}
      </span>

      {/* Tags row */}
      {tags && tags.length > 0 && (
        <div className="mt-2 flex flex-wrap justify-center gap-1">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-mono text-stone-500 border border-black/5"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Featured badge */}
      {featured && (
        <span className="absolute top-2 right-2 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-mono font-medium text-amber-800 tracking-wider uppercase">
          featured
        </span>
      )}
    </Link>
  );
}
