"use client";
import { useState, useEffect } from "react";

interface MultiSelectProps {
  label?: string;
  placeholder?: string;
  options: string[];
  value?: string[]; // for controlled form use
  onChange?: (selected: string[]) => void; // callback to parent
}

export default function MultiSelect({
  label = "Select Items",
  placeholder = "Choose an option",
  options,
  value,
  onChange,
}: MultiSelectProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>(value || []);

  // Update internal state when parent changes value
  useEffect(() => {
    if (value) setSelectedItems(value);
  }, [value]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val && !selectedItems.includes(val)) {
      const updated = [...selectedItems, val];
      setSelectedItems(updated);
      onChange?.(updated);
    }
    e.target.value = ""; // reset
  };

  const removeItem = (item: string) => {
    const updated = selectedItems.filter((i) => i !== item);
    setSelectedItems(updated);
    onChange?.(updated);
  };

  const availableOptions = options.filter((opt) => !selectedItems.includes(opt));

  return (
    <div>
      {label && (
        <label className="block font-saira text-sm font-medium mb-2 text-gray-700">
          {label}
        </label>
      )}

      {/* Select dropdown */}
      <div className="relative">
        <select
          onChange={handleSelect}
          className="block appearance-none w-full border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="">{placeholder}</option>
          {availableOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* Custom arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>

      {/* Selected chips */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedItems.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 bg-primary/10 border border-primary text-primary rounded-full px-3 py-1 text-sm font-saira"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => removeItem(item)}
                className="text-primary hover:text-danger transition"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
