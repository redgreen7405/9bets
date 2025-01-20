// components/DropdownMenu.jsx
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

export const DropdownMenu = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 text-sm bg-white border rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <span className="text-gray-700 truncate">
          {value === ""
            ? placeholder
            : options.find((opt) => opt.value === value)?.label}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg">
          <ul className="py-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <li
                key={option.value}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-red-50 
                  ${
                    option.value === value
                      ? "bg-red-50 text-red-700"
                      : "text-gray-700"
                  }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  {option.color && (
                    <span
                      className={`w-3 h-3 rounded-full ${option.color} flex-shrink-0`}
                    />
                  )}
                  <span className="truncate">{option.label}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
