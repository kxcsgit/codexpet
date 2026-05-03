import { PetCard } from "@/shared/components/pet-card";
import { getAllPets, getCategories } from "@/shared/lib/pets";
import Link from "next/link";

export default function HomePage() {
  const pets = getAllPets();
  const categories = getCategories();
  const featured = pets.filter((p) => p.featured);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Hero */}
      <section className="mb-16 text-center">
        <div className="mb-4 text-6xl">🐾</div>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Find Your Perfect
          <br />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Desktop Pet
          </span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-500">
          The ultimate directory for desktop pets. Browse AI companions, classic
          mascots, indie creations, and more. All free, all awesome.
        </p>
        <div className="flex justify-center gap-3">
          <a
            href="#featured"
            className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700"
          >
            Browse Pets
          </a>
          <Link
            href="/submit"
            className="rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:border-gray-400"
          >
            Submit a Pet
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-16 grid grid-cols-3 gap-4 text-center">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="text-3xl font-bold text-indigo-600">{pets.length}</div>
          <div className="text-sm text-gray-500">Pets Listed</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="text-3xl font-bold text-purple-600">{categories.length}</div>
          <div className="text-sm text-gray-500">Categories</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="text-3xl font-bold text-pink-600">∞</div>
          <div className="text-sm text-gray-500">Joy</div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section id="featured" className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">⭐ Featured Pets</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((pet) => (
              <PetCard key={pet.slug} {...pet} />
            ))}
          </div>
        </section>
      )}

      {/* All Pets */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">🐾 All Pets</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <PetCard key={pet.slug} {...pet} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">📂 Browse by Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/category/${cat}`}
              className="rounded-xl border border-gray-200 bg-white p-4 text-center font-medium capitalize transition-all hover:border-indigo-300 hover:shadow-md"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-12 text-center text-white">
        <h2 className="mb-4 text-3xl font-bold">Know a great desktop pet?</h2>
        <p className="mb-6 text-indigo-100">
          Help the community discover new digital companions. Submit your favorite pets!
        </p>
        <Link
          href="/submit"
          className="inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow hover:bg-gray-100"
        >
          Submit a Pet →
        </Link>
      </section>
    </div>
  );
}
