import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Pet {
  slug: string;
  name: string;
  description: string;
  category: string;
  platform: string[];
  image: string;
  downloadUrl: string;
  featured: boolean;
  tags: string[];
  kind?: string;
  author?: string;
  stars?: number;
  content: string;
}

const petsDirectory = path.join(process.cwd(), "content/pets");

export function getAllPets(): Pet[] {
  if (!fs.existsSync(petsDirectory)) return [];
  const fileNames = fs.readdirSync(petsDirectory).filter((f) => f.endsWith(".mdx"));
  const pets = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, "");
    const fullPath = path.join(petsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    return { slug, content, ...data } as Pet;
  });
  return pets.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
}

export function getPetBySlug(slug: string): Pet | undefined {
  const fullPath = path.join(petsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return undefined;
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  return { slug, content, ...data } as Pet;
}

export function getCategories(): string[] {
  const pets = getAllPets();
  return [...new Set(pets.map((p) => p.category))].sort();
}

export function getPetsByCategory(category: string): Pet[] {
  return getAllPets().filter((p) => p.category === category);
}

export function getFeaturedPets(): Pet[] {
  return getAllPets().filter((p) => p.featured);
}
