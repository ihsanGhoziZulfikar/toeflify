'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import { useUserStore } from '@/lib/store/userStore';

export default function ProfileIcon() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { profile } = useUserStore();

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
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Profile menu" className="rounded-full bg-gray-100 flex items-center p-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary">
        <span className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 block">
          <Image src={profile?.image_url ?? '/assets/images/profile_default.jpg'} alt={profile?.full_name ?? 'Profile'} width={48} height={48} className="w-full h-full object-cover" />
        </span>
        <span className="p-2">
          <ChevronDown className={`transition-transform duration-200 ${open ? 'rotate-180 text-primary' : ''}`} />
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 z-50">
          <ProfileDropdown />
        </div>
      )}
    </div>
  );
}
