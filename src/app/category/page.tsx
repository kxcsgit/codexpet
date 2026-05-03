import Link from "next/link";
import { getCategories, getAllPets } from "@/shared/lib/pets";

export default function CategoryIndexPage() {
  const categories = getCategories();
  const pets = getAllPets();

  const categoryLabels: Record<string, { icon: string; description: string }> = {
    "ai-tool": { icon: "🤖", description: "AI-powered coding companions and assistants" },
    indie: { icon: "🎨", description: "Creative indie desktop pet projects" },
    classic: { icon: "🕹️", description: "Timeless desktop mascots and companions" },
    browser: { icon: "🌐", description: "Browser extension pets" },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-extrabold text-gray-900">📂 Categories</h1>
      <p className="mb-8 text-gray-500">Browse desktop pets by type</p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {categories.map((cat) => {
          const count = pets.filter((p) => p.category === cat).length;
          const info = categoryLabels[cat] || { icon: "📦", description: "" };
          return (
            <Link
              key={cat}
              href={`/category/${cat}`}
              className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-indigo-300 hover:shadow-lg"
            >
              <div className="mb-3 text-4xl">{info.icon}</div>
              <h2 className="mb-1 text-xl font-bold capitalize text-gray-900 group-hover:text-indigo-600">
                {cat}
              </h2>
              <p className="mb-3 text-sm text-gray-500">{info.description}</p>
              <span className="text-sm font-medium text-indigo-600">
                {count} {count === 1 ? "pet" : "pets"} →
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
