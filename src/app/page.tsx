import { getAllPets, getCategories } from "@/shared/lib/pets";
import { HomePageClient } from "./home-client";

export default function HomePage() {
  const pets = getAllPets();
  const categories = getCategories();
  return <HomePageClient pets={pets} categoryCount={categories.length} />;
}
