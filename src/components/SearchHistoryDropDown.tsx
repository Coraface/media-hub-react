import React, { ForwardedRef } from "react";

interface SearchHistoryDropdownProps {
  searchHistory: string[];
  onSelectTerm: (selectedTerm: string) => void;
  onClearHistory: (e: React.MouseEvent) => void;
  classNames: string;
}

const SearchHistoryDropdown = React.forwardRef(
  (
    {
      searchHistory,
      onSelectTerm,
      onClearHistory,
      classNames,
    }: SearchHistoryDropdownProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div ref={ref} className={` ${classNames} max-h-60 overflow-y-auto p-2`}>
        <div className="flex justify-between items-center p-2">
          <span className="text-gray-600 text-sm">Search History</span>
          <button
            onClick={onClearHistory}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        </div>
        <ul className="space-y-2">
          {searchHistory.map((term, index) => (
            <li
              key={index}
              onClick={() => onSelectTerm(term)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {term}
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

SearchHistoryDropdown.displayName = "SearchHistoryDropdown"; // Set displayName for debugging purposes

export default SearchHistoryDropdown;
