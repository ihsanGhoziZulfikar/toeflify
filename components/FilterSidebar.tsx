'use client';

import { Chapter, Section, Skill, TopicGroup } from '@/lib/types';
import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

type HierarchySection = Section & {
  slug_str?: string;
  chapters?: Array<
    Chapter & {
      slug_str?: string;
      topicGroups?: Array<
        TopicGroup & {
          slug_str?: string;
          skills?: Array<Skill & { slug_str?: string }>;
        }
      >;
    }
  >;
};

type SelectedFilters = {
  section?: string | null;
  chapter?: string | null;
  topic?: string | null;
};

type SelectOption = {
  _id?: string;
  _key?: string;
  name?: string;
  slug_str?: string;
};

interface FilterSidebarProps {
  filterData: HierarchySection[];
  onFilterChange: (key: string, value: string) => void;
  selectedFilters?: SelectedFilters;
}

export default function FilterSidebar({ filterData, onFilterChange, selectedFilters }: FilterSidebarProps) {
  const isControlled = Boolean(selectedFilters);
  const [internalSection, setInternalSection] = useState<string | null>(selectedFilters?.section ?? null);
  const [internalChapter, setInternalChapter] = useState<string | null>(selectedFilters?.chapter ?? null);
  const [internalTopic, setInternalTopic] = useState<string | null>(selectedFilters?.topic ?? null);
  const [openDropdown, setOpenDropdown] = useState<'section' | 'chapter' | 'topic' | null>(null);

  const section = selectedFilters?.section ?? internalSection;
  const chapter = selectedFilters?.chapter ?? internalChapter;
  const topic = selectedFilters?.topic ?? internalTopic;

  const selectedSection = filterData?.find((s) => s.slug_str === section);
  const selectedChapter = selectedSection?.chapters?.find((c) => c.slug_str === chapter);

  const handleSelect = (key: 'section' | 'chapter' | 'topic', value: string | null) => {
    if (!isControlled) {
      if (key === 'section') {
        setInternalSection(value);
        setInternalChapter(null);
        setInternalTopic(null);
      } else if (key === 'chapter') {
        setInternalChapter(value);
        setInternalTopic(null);
      } else {
        setInternalTopic(value);
      }
    }
    onFilterChange(key, value || '');
    setOpenDropdown(null);
  };

  const handleClear = (key: 'section' | 'chapter' | 'topic') => {
    if (!isControlled) {
      if (key === 'section') {
        setInternalSection(null);
        setInternalChapter(null);
        setInternalTopic(null);
      } else if (key === 'chapter') {
        setInternalChapter(null);
        setInternalTopic(null);
      } else {
        setInternalTopic(null);
      }
    }
    onFilterChange(key, '');
  };

  const renderDropdown = (key: 'section' | 'chapter' | 'topic', options: SelectOption[], selected: string | null) => {
    const isOpen = openDropdown === key;
    const selectedItem = selected ? options.find((o) => o.slug_str === selected)?.name : null;

    return (
      <div className="relative my-4 text-sm">
        {/* Input-like button */}
        <div className="flex items-center">
          <button onClick={() => setOpenDropdown(isOpen ? null : key)} className={`w-full bg-gray-200 px-3 py-2 rounded-2xl flex justify-between items-center focus:ring-2 focus:ring-blue-300 transition ${selectedItem ? 'pr-8' : ''}`}>
            <span className="truncate text-left">{selectedItem || `Select ${key.charAt(0).toUpperCase() + key.slice(1)}`}</span>
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {/* Clear button (X) */}
          {selectedItem && (
            <button onClick={() => handleClear(key)} className="absolute right-2 p-1 text-gray-500 hover:text-red-500 transition" aria-label="Clear selection">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Dropdown list */}
        {isOpen && (
          <div className="rounded-lg shadow-sm mt-2 bg-white z-10 p-2 animate-fade-in">
            {options.map((opt) => (
              <label key={opt._id || opt._key} className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded cursor-pointer">
                <input type="radio" name={key} value={opt.slug_str} checked={selected === opt.slug_str} onChange={() => handleSelect(key, opt.slug_str ?? null)} className="accent-blue-500" />
                <span>{opt.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full rounded-2xl border border-gray-100 bg-white shadow-sm p-5 h-fit overflow-y-auto">
      {/* Topics Label */}
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Topics</h3>
      </div>

      {renderDropdown('section', filterData, section)}

      {selectedSection?.chapters && renderDropdown('chapter', selectedSection.chapters, chapter)}

      {selectedChapter?.topicGroups && renderDropdown('topic', selectedChapter.topicGroups, topic)}
    </div>
  );
}
