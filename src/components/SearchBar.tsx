import React, { useState, useEffect, useRef } from "react";
import { VscSearch } from "react-icons/vsc";
import GenericDropdown from "./GenericDropdown";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (term: string) => void;
  storageKey?: string;
  maxHistory?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search",
  onSearch,
  storageKey = "searchHistory",
  maxHistory = 5,
}) => {
  const [term, setTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Load search history from localStorage on mount
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem(storageKey) || "[]");
    setSearchHistory(storedHistory);
  }, [storageKey]);

  // Save search history to localStorage
  const saveToLocalStorage = (history: string[]) => {
    localStorage.setItem(storageKey, JSON.stringify(history));
    setSearchHistory(history);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (term.trim()) {
      const updatedHistory = [
        term,
        ...searchHistory.filter((t) => t !== term),
      ].slice(0, maxHistory);
      saveToLocalStorage(updatedHistory);
      setIsDropdownOpen(false);
      onSearch(term); // Call the onSearch function passed as a prop
    }
  };

  const handleSelectTerm = (selectedTerm: string) => {
    setTerm(selectedTerm);
    setIsDropdownOpen(false);
    onSearch(selectedTerm); // Use the term directly
  };

  const handleClearHistory = () => {
    localStorage.removeItem(storageKey);
    setSearchHistory([]);
    setIsDropdownOpen(false);
  };

  const handleFocus = () => {
    if (searchHistory.length > 0) {
      setIsDropdownOpen(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDropdownOpen(false);
    setTerm(e.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      } else if (
        inputRef.current &&
        inputRef.current.contains(event.target as Node) &&
        searchHistory.length > 0
      ) {
        setIsDropdownOpen(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchHistory]);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={term}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          autoComplete="off"
          className="pr-10 pl-4 py-2 w-full border rounded-full bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <VscSearch className="h-5 w-5 text-gray-500" />
        </div>

        {isDropdownOpen && (
          <GenericDropdown
            ref={dropdownRef}
            header="Search History"
            options={searchHistory.map((term) => ({
              label: term,
              onClick: () => handleSelectTerm(term),
            }))}
            onClearHistory={handleClearHistory}
            classNames="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg z-50 border border-gray-200 rounded-md"
          />
        )}
      </div>
    </form>
  );
};

export default SearchBar;
