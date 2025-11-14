'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';

export default function ProfileIcon() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Profile Button */}
      <div
        onClick={() => setOpen(!open)}
        className="rounded-full bg-gray-100 flex items-center p-1 cursor-pointer"
      >
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <img
            src="/assets/images/profile_default.jpg"
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-2">
          <ChevronDown />
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 z-50">
          <ProfileDropdown />
        </div>
      )}
    </div>
  );
}
