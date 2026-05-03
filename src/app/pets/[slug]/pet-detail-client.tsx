"use client";

import { PetSprite } from "@/shared/components/pet-sprite";
import { useState } from "react";

interface PetDetailClientProps {
  image: string;
  name: string;
  spriteRow?: number;
  spriteFrames?: number;
  spriteDuration?: string;
}

const ANIMATION_STATES = [
  { row: 0, label: "Idle" },
  { row: 1, label: "Walk Right" },
  { row: 2, label: "Walk Left" },
  { row: 3, label: "Wave" },
  { row: 4, label: "Jump" },
  { row: 5, label: "Sad" },
  { row: 6, label: "Review" },
  { row: 7, label: "Sleep" },
  { row: 8, label: "Extra" },
];

export function PetDetailClient({
  image,
  name,
  spriteRow = 0,
  spriteFrames = 6,
  spriteDuration = "1100ms",
}: PetDetailClientProps) {
  const [activeRow, setActiveRow] = useState(spriteRow ?? 0);
  const activeState = ANIMATION_STATES[activeRow] || ANIMATION_STATES[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Sprite preview card */}
      <div className="relative flex items-center justify-center rounded-2xl border border-black/5 bg-white/55 backdrop-blur-md p-8">
        <PetSprite
          image={image}
          name={name}
          spriteRow={activeRow}
          spriteFrames={spriteFrames}
          spriteDuration={spriteDuration}
          scale={1}
        />
        {/* State label */}
        <span className="absolute bottom-3 right-3 rounded-full bg-black/5 px-2.5 py-0.5 font-mono text-[10px] tracking-[0.12em] text-stone-500 uppercase">
          {activeState.label}
        </span>
      </div>

      {/* State selector tabs */}
      <div className="flex flex-wrap gap-1.5">
        {ANIMATION_STATES.map((state) => (
          <button
            key={state.row}
            onClick={() => setActiveRow(state.row)}
            className={`rounded-full px-3 py-1 font-mono text-[10px] tracking-[0.08em] uppercase transition ${
              activeRow === state.row
                ? "bg-[#3847f5] text-white"
                : "bg-white/70 border border-black/5 text-stone-500 hover:bg-white hover:text-[#1a1d2e]"
            }`}
          >
            {state.label}
          </button>
        ))}
      </div>
    </div>
  );
}
