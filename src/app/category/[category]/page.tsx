import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PetCard } from "@/shared/components/pet-card";
import { getAllPets, getCategories } from "@/shared/lib/pets";
import Link from "next/link";

export function generateStaticParams() {
  return getCategories().map((category) => ({ category }));
}

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return {
    title: `${category} Desktop Pets`,
    description: `Browse the best ${category} desktop pets. Find your perfect digital companion.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const allPets = getAllPets();
  const pets = allPets.filter((p) => p.category === category);
  const categories = getCategories();

  if (pets.length === 0) return notFound();

  const categoryLabels: Record<string, string> = {
    "ai-tool": "🤖 AI Tool Pets",
    indie: "🎨 Indie Pets",
    classic: "🕹️ Classic Pets",
    browser: "🌐 Browser Pets",
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 capitalize">{category}</span>
      </nav>

      <h1 className="mb-2 text-3xl font-extrabold text-gray-900">
        {categoryLabels[category] || category}
      </h1>
      <p className="mb-8 text-gray-500">
        {pets.length} {pets.length === 1 ? "pet" : "pets"} found
      </p>

      {/* Category Nav */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/category/${cat}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              cat === category
                ? "bg-indigo-600 text-white"
                : "border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {categoryLabels[cat] || cat}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pets.map((pet) => (
          <PetCard key={pet.slug} {...pet} />
        ))}
      </div>
    </div>
  );
}
