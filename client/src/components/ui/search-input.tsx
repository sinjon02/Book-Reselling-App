import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect, FormEvent } from "react";
import { useLocation } from "wouter";

interface SearchInputProps {
  onSearch?: (searchTerm: string) => void;
  autoFocus?: boolean;
}

export function SearchInput({ onSearch, autoFocus = false }: SearchInputProps) {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  // Parse search from URL on initial load
  useEffect(() => {
    if (location.startsWith("/books") && location.includes("search=")) {
      const searchParams = new URLSearchParams(location.split("?")[1]);
      const search = searchParams.get("search") || "";
      setSearchTerm(search);
    }
  }, [location]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder="Search for books..."
        className="pl-10 pr-4 py-2 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        autoFocus={autoFocus}
      />
    </form>
  );
}
