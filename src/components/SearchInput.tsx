import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { VscSearch } from "react-icons/vsc";
import SearchHistoryDropdown from "./SearchHistoryDropDown";

const SearchForm = () => {
  const [term, setTerm] = useState(""); // Controlled input value
  const [searchHistory, setSearchHistory] = useState<string[]>([]); // Local state for search history
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown visibility
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Load search history from localStorage on mount
  useEffect(() => {
    const storedHistory = JSON.parse(
      localStorage.getItem("searchHistory") || "[]"
    );
    setSearchHistory(storedHistory);
  }, []);

  // Save search history to localStorage when it changes
  const saveToLocalStorage = (history: string[]) => {
    localStorage.setItem("searchHistory", JSON.stringify(history));
    setSearchHistory(history);
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (term.trim()) {
      const updatedHistory = [
        term,
        ...searchHistory.filter((t) => t !== term),
      ].slice(0, 5);
      saveToLocalStorage(updatedHistory);
      setIsDropdownOpen(false); // Close dropdown after submission
      navigate(`/search?term=${term}`);
    }
  };

  // Handle selecting a term from history
  const handleSelectTerm = (selectedTerm: string) => {
    setTerm(selectedTerm);
    setIsDropdownOpen(false);
    navigate(`/search?term=${selectedTerm}`);
  };

  // Handle clearing the search history
  const handleClearHistory = () => {
    localStorage.removeItem("searchHistory");
    setSearchHistory([]);
    setIsDropdownOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onFocus={() => {
            if (searchHistory.length > 0) {
              setIsDropdownOpen(true);
            }
          }}
          placeholder="Search"
          autoComplete="off"
          className="pr-10 pl-4 py-2 w-full border rounded-full bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <VscSearch className="h-5 w-5 text-gray-500" />
        </div>

        {/* Dropdown */}
        {isDropdownOpen && (
          <SearchHistoryDropdown
            ref={dropdownRef}
            searchHistory={searchHistory}
            onSelectTerm={handleSelectTerm}
            onClearHistory={handleClearHistory}
            classNames="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg z-50 border border-gray-200 rounded-md"
          />
        )}
      </div>
    </form>
  );
};

export default SearchForm;
