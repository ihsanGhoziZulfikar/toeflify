'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import ProfileIcon from './ProfileIcon';

type NavItem = { href: string; label: string };

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/lessons', label: 'Lessons' },
  { href: '/practice', label: 'Practice' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);  

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-zinc-200">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6"
        aria-label="Main Navigation"
      >
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/images/logo.svg"
              alt="logo"
              width={37}
              height={37}
              className="object-contain"
              priority
            />
            <span className="font-rowdies text-3xl font-semibold tracking-tight text-primary">
              TOEFLify
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    'rounded-md px-3 py-2 text-md transition-colors font-saira',
                    isActive(item.href)
                      ? 'text-primary font-bold'
                      : 'text-zinc-500 font-light hover:bg-zinc-100',
                  ].join(' ')}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/custom-exercise"
            className="rounded-md bg-primary font-bold px-5 py-3 text-md text-white font-saira"
          >
            Custom Exercise
          </Link>
                      
          <ProfileIcon/>
        </div>

        <button
          className="inline-flex text-primary items-center justify-center rounded-md p-2 md:hidden hover:bg-zinc-100"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-zinc-200">
          <ul className="space-y-1 px-4 py-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={[
                    'block rounded-md px-3 py-2 text-sm text-center font-saira',
                    isActive(item.href)
                      ? 'text-primary font-bold'
                      : 'text-zinc-500 font-light hover:bg-zinc-100',
                  ].join(' ')}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            <li className="mt-2 flex gap-2">
              <Link
                href="/custom-exercise"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-md bg-primary font-bold text-center px-5 py-3 text-sm text-white font-saira"
              >
                Custom Exercise
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
