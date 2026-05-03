import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllPets, getPetBySlug } from "@/shared/lib/pets";
import { MDXRemote } from "next-mdx-remote/rsc";
import { PetDetailClient } from "./pet-detail-client";

export function generateStaticParams() {
  return getAllPets().map((pet) => ({ slug: pet.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pet = getPetBySlug(slug);
  if (!pet) return {};
  return {
    title: pet.name,
    description: pet.description,
    openGraph: {
      title: `${pet.name} — CodexPet`,
      description: pet.description,
      images: [pet.image],
    },
  };
}

export default async function PetPage({ params }: Props) {
  const { slug } = await params;
  const pet = getPetBySlug(slug);
  if (!pet) return notFound();

  const kindLabels: Record<string, string> = {
    creature: "creature",
    character: "character",
    object: "object",
    mascot: "mascot",
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 md:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <Link href="/" className="text-[#4f515c] hover:text-black transition">
          Home
        </Link>
        <span className="mx-2 text-stone-300">/</span>
        <span className="text-[#1a1d2e]">{pet.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Animated sprite preview */}
        <PetDetailClient
          image={pet.image}
          name={pet.name}
          spriteRow={pet.spriteRow}
          spriteFrames={pet.spriteFrames}
          spriteDuration={pet.spriteDuration}
        />

        <div className="flex flex-col justify-center">
          {/* Tags */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            {pet.kind && (
              <span className="rounded-full bg-[#eef1ff] px-2.5 py-0.5 font-mono text-[10px] tracking-[0.12em] text-[#3847f5] uppercase">
                {kindLabels[pet.kind] || pet.kind}
              </span>
            )}
            {pet.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/70 border border-black/5 px-2.5 py-0.5 font-mono text-[10px] tracking-[0.08em] text-stone-500"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mb-3 text-3xl font-semibold tracking-tight text-[#1a1d2e]">
            {pet.name}
          </h1>
          <p className="mb-4 text-base leading-7 text-[#4f515c]">
            {pet.description}
          </p>

          <div className="mb-6 flex flex-col gap-2 text-sm text-[#4f515c]">
            {pet.author && (
              <div>
                <span className="font-medium text-[#1a1d2e]">Author:</span>{" "}
                {pet.author}
              </div>
            )}
            {pet.stars && (
              <div>
                <span className="font-medium text-[#1a1d2e]">Stars:</span>{" "}
                {pet.stars.toLocaleString()}
              </div>
            )}
          </div>

          <a
            href={pet.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-medium text-white transition hover:bg-black/85"
          >
            Download / Visit →
          </a>
        </div>
      </div>

      {/* Content */}
      <article className="prose prose-gray max-w-none">
        <MDXRemote source={pet.content} />
      </article>

      {/* Back */}
      <div className="mt-12 border-t border-black/10 pt-6">
        <Link
          href="/"
          className="text-sm text-[#3847f5] hover:text-[#1a1d2e] transition"
        >
          ← Back to all pets
        </Link>
      </div>
    </div>
  );
}
