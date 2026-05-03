"use client";

import Link from "next/link";
import { PetSprite } from "./pet-sprite";

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
  spriteRow?: number;
  spriteFrames?: number;
  spriteDuration?: string;
}

export function PetCard({
  slug,
  name,
  image,
  featured,
  tags,
  spriteRow,
  spriteFrames,
  spriteDuration,
}: PetCardProps) {
  return (
    <Link
      href={`/pets/${slug}`}
      className="group relative flex flex-col items-center rounded-2xl border border-white/70 bg-white/55 px-3 pt-3 pb-4 shadow-lg shadow-blue-900/10 backdrop-blur-md transition hover:-translate-y-1 hover:bg-white"
    >
      <PetSprite
        image={image}
        name={name}
        spriteRow={spriteRow}
        spriteFrames={spriteFrames}
        spriteDuration={spriteDuration}
        scale={0.5}
      />

      <span className="mt-1 font-mono text-[10px] tracking-[0.18em] text-stone-700 uppercase">
        {name}
      </span>

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

      {featured && (
        <span className="absolute top-2 right-2 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-mono font-medium text-amber-800 tracking-wider uppercase">
          featured
        </span>
      )}
    </Link>
  );
}
