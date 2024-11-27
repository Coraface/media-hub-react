import React, { ForwardedRef } from "react";

interface DropdownOption {
  label: string;
  onClick: () => void;
}

interface DropdownProps {
  options: DropdownOption[]; // Generic options
  header?: string; // Optional header for the dropdown
  onClearHistory?: (e: React.MouseEvent) => void; // Optional for "Clear" functionality
  classNames?: string; // Additional styles
}

const GenericDropdown = React.forwardRef(
  (
    { options, header, onClearHistory, classNames }: DropdownProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className={`${classNames} max-h-60 overflow-y-auto bg-white shadow-md rounded-md p-2`}
      >
        {/* Optional Header */}
        {header && (
          <div className="flex justify-between items-center px-2 pb-2 border-b">
            <span className="text-gray-600 text-sm">{header}</span>
            {onClearHistory && (
              <button
                onClick={onClearHistory}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Options List */}
        <ul className="space-y-2 pt-2">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={option.onClick}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-md"
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

GenericDropdown.displayName = "GenericDropdown";

export default GenericDropdown;
