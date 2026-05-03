import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllPets, getPetBySlug } from "@/shared/lib/pets";
import { MDXRemote } from "next-mdx-remote/rsc";

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

  const platformIcons: Record<string, string> = {
    windows: "🪟 Windows",
    macos: "🍎 macOS",
    linux: "🐧 Linux",
    browser: "🌐 Browser",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/category/${pet.category}`} className="hover:text-gray-900 capitalize">
          {pet.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{pet.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pet.image}
            alt={pet.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="mb-3 flex flex-wrap gap-2">
            {pet.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mb-3 text-3xl font-extrabold text-gray-900">{pet.name}</h1>
          <p className="mb-4 text-gray-500">{pet.description}</p>

          <div className="mb-4 flex flex-col gap-2 text-sm text-gray-600">
            {pet.author && (
              <div>
                <span className="font-medium text-gray-900">Author:</span> {pet.author}
              </div>
            )}
            {pet.stars && (
              <div>
                <span className="font-medium text-gray-900">Stars:</span> ⭐ {pet.stars.toLocaleString()}
              </div>
            )}
            <div>
              <span className="font-medium text-gray-900">Platforms:</span>{" "}
              {pet.platform.map((p) => platformIcons[p] || p).join(" · ")}
            </div>
          </div>

          <a
            href={pet.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700"
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
      <div className="mt-12 border-t border-gray-200 pt-6">
        <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-700">
          ← Back to all pets
        </Link>
      </div>
    </div>
  );
}
