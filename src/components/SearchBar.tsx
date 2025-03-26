
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  // Handle input changes and immediately update search results
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery); // Immediately trigger search as user types
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative w-full mx-auto mb-0 glass dark:glass-dark rounded-full shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
    >
      <div className="flex items-center">
        <div className="flex items-center justify-center pl-4">
          <Search className="h-5 w-5 text-muted-foreground transition-all duration-300" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search communities..."
          className="flex-grow px-4 py-3 bg-transparent border-none outline-none focus:ring-0 transition-all duration-300"
          aria-label="Search communities"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="mr-1 transition-all duration-200 hover:rotate-90"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="submit"
          className="m-1 bg-aquamarine text-primary-foreground hover:bg-aquamarine/90 transition-all duration-300 hover:shadow-md"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
