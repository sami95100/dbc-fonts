import { SearchPageContent } from "@/components/layout/SearchBar";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  return <SearchPageContent initialQuery={q ?? ""} />;
}
