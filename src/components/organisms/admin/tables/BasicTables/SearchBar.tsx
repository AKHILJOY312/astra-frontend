import { useDebounce } from "@/hooks/useDebounce";
import React from "react";

interface SearchBarProps {
  onSearchChange: (search: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearchChange,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  // Use the debounce hook
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms debounce

  // Effect to trigger parent component update only after debounce
  React.useEffect(() => {
    onSearchChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearchChange]);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border-b dark:border-white/5">
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={isLoading}
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
      />
      {isLoading && (
        <span className="text-xs text-gray-500 mt-1 block">Searching...</span>
      )}
    </div>
  );
};
