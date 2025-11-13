'use client';

import { Section } from '@/lib/types';
import { useState } from 'react';
import { ChevronDown, ChevronUp, X, Search } from 'lucide-react';

export default function FilterSidebar({
  filterData,
  onFilterChange,
}: {
  filterData: Section[];
  onFilterChange: (key: string, value: string) => void;
}) {
  const [section, setSection] = useState<string | null>(null);
  const [chapter, setChapter] = useState<string | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<'section' | 'chapter' | 'topic' | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedSection = filterData?.find((s) => s.slug_str === section);
  const selectedChapter = selectedSection?.chapters?.find((c) => c.slug_str === chapter);

  const handleSelect = (key: 'section' | 'chapter' | 'topic', value: string | null) => {
    if (key === 'section') {
      setSection(value);
      setChapter(null);
      setTopic(null);
    } else if (key === 'chapter') {
      setChapter(value);
      setTopic(null);
    } else {
      setTopic(value);
    }
    onFilterChange(key, value || '');
    setOpenDropdown(null);
  };

  const handleClear = (key: 'section' | 'chapter' | 'topic') => {
    if (key === 'section') {
      setSection(null);
      setChapter(null);
      setTopic(null);
    } else if (key === 'chapter') {
      setChapter(null);
      setTopic(null);
    } else {
      setTopic(null);
    }
    onFilterChange(key, '');
  };

  const renderDropdown = (
    key: 'section' | 'chapter' | 'topic',
    options: any[],
    selected: string | null
  ) => {
    const isOpen = openDropdown === key;
    const selectedItem = selected ? options.find((o) => o.slug_str === selected)?.name : null;

    return (
      <div className="relative my-4 text-sm">
        {/* Input-like button */}
        <div className="flex items-center">
          <button
            onClick={() => setOpenDropdown(isOpen ? null : key)}
            className={`w-full bg-gray-200 px-3 py-2 rounded-2xl flex justify-between items-center focus:ring-2 focus:ring-blue-300 transition ${
              selectedItem ? 'pr-8' : ''
            }`}
          >
            <span className="truncate text-left">
              {selectedItem || `Select ${key.charAt(0).toUpperCase() + key.slice(1)}`}
            </span>
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {/* Clear button (X) */}
          {selectedItem && (
            <button
              onClick={() => handleClear(key)}
              className="absolute right-2 p-1 text-gray-500 hover:text-red-500 transition"
              aria-label="Clear selection"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Dropdown list */}
        {isOpen && (
          <div className="rounded-lg shadow-sm mt-2 bg-white z-10 p-2 animate-fade-in">
            {options.map((opt) => (
              <label
                key={opt._id || opt._key}
                className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded cursor-pointer"
              >
                <input
                  type="radio"
                  name={key}
                  value={opt.slug_str}
                  checked={selected === opt.slug_str}
                  onChange={() => handleSelect(key, opt.slug_str)}
                  className="accent-blue-500"
                />
                <span>{opt.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-72 rounded-lg shadow-md p-5 h-fit overflow-y-auto">
      {/* Search Input */}
      <div className="relative mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-200 pl-10 pr-3 py-2 rounded-2xl focus:ring-2 focus:ring-blue-300 focus:outline-none transition text-sm"
          />
        </div>
      </div>

      {/* Topics Label */}
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Topics</h3>
      </div>

      {renderDropdown('section', filterData, section)}

      {selectedSection?.chapters &&
        renderDropdown('chapter', selectedSection.chapters, chapter)}

      {selectedChapter?.topicGroups &&
        renderDropdown('topic', selectedChapter.topicGroups, topic)}
    </div>
  );
}
