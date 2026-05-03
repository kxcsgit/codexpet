"use client";

interface PetSpriteProps {
  image: string;
  name: string;
  /** Which row of the spritesheet to animate (0-indexed, 208px per row) */
  spriteRow?: number;
  /** Number of frames in the animation */
  spriteFrames?: number;
  /** Duration of one animation cycle */
  spriteDuration?: string;
  /** Scale factor (1 = full 192x208) */
  scale?: number;
  /** Whether to auto-cycle through all rows */
  cycleStates?: boolean;
  cycleIntervalMs?: number;
  className?: string;
}

export function PetSprite({
  image,
  name,
  spriteRow = 0,
  spriteFrames = 6,
  spriteDuration = "1100ms",
  scale = 1,
  cycleStates = false,
  cycleIntervalMs = 2000,
  className = "",
}: PetSpriteProps) {
  const row = spriteRow;
  const frames = spriteFrames;
  const duration = spriteDuration;

  return (
    <div
      className={`pet-sprite-frame ${className}`}
      style={{ "--pet-scale": String(scale) } as React.CSSProperties}
    >
      <div
        className="pet-sprite"
        role="img"
        aria-label={`${name} animated`}
        style={{
          "--sprite-url": `url(${image})`,
          "--sprite-row": String(row),
          "--sprite-frames": String(frames),
          "--sprite-duration": duration,
        } as React.CSSProperties}
      />
    </div>
  );
}
