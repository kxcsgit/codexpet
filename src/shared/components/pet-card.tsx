import Link from "next/link";

interface PetCardProps {
  slug: string;
  name: string;
  description: string;
  category: string;
  platform: string[];
  image: string;
  featured?: boolean;
  stars?: number;
}

export function PetCard({
  slug,
  name,
  description,
  category,
  platform,
  image,
  featured,
  stars,
}: PetCardProps) {
  const categoryColors: Record<string, string> = {
    "ai-tool": "bg-purple-100 text-purple-700",
    indie: "bg-orange-100 text-orange-700",
    classic: "bg-blue-100 text-blue-700",
    browser: "bg-green-100 text-green-700",
  };

  const platformIcons: Record<string, string> = {
    windows: "🪟",
    macos: "🍎",
    linux: "🐧",
    browser: "🌐",
  };

  return (
    <Link
      href={`/pets/${slug}`}
      className="group block rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-lg"
    >
      <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {featured && (
          <span className="absolute top-3 left-3 rounded-full bg-yellow-400 px-2.5 py-0.5 text-xs font-semibold text-yellow-900">
            ⭐ Featured
          </span>
        )}
      </div>

      <div className="mb-2 flex items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${categoryColors[category] || "bg-gray-100 text-gray-700"}`}
        >
          {category}
        </span>
        <div className="flex gap-1">
          {platform.map((p) => (
            <span key={p} title={p}>
              {platformIcons[p] || "❓"}
            </span>
          ))}
        </div>
      </div>

      <h3 className="mb-1 text-lg font-bold text-gray-900 group-hover:text-indigo-600">
        {name}
      </h3>
      <p className="line-clamp-2 text-sm text-gray-500">{description}</p>

      {stars && (
        <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
          ⭐ {stars.toLocaleString()} stars
        </div>
      )}
    </Link>
  );
}
