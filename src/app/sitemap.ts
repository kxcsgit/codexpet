import type { MetadataRoute } from "next";
import { getAllPets, getCategories } from "@/shared/lib/pets";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://codexpet.space";
  const pets = getAllPets();
  const categories = getCategories();

  const petPages = pets.map((pet) => ({
    url: `${base}/pets/${pet.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages = categories.map((cat) => ({
    url: `${base}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/category`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/submit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...petPages,
    ...categoryPages,
  ];
}
