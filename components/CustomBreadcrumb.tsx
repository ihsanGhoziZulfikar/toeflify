'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

const toTitle = (s: string) =>
  s.replace(/[-_]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());

export default function CustomBreadcrumb({
  root = [{ href: '/', label: 'Home' }],
  labelMap = {},
}: {
  root?: { href: string; label: string }[];
  labelMap?: Record<string, string>;
}) {
  const pathname = usePathname();

  if (!pathname || pathname === '/') return null;

  const segs = pathname.split('/').filter(Boolean);

  const items = segs.reduce<{ href: string; label: string }[]>((acc, seg) => {
    const href = `${acc.length ? acc[acc.length - 1].href : ''}/${seg}`;
    const label = labelMap[seg] ?? toTitle(seg);
    return [...acc, { href, label }];
  }, []);

  const all = root.concat(items);
  const last = all.length - 1;

  return (
    <div className="w-full bg-[rgba(65,160,229,0.65)]">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-2">
        <Breadcrumb>
          <BreadcrumbList className="text-primary-foreground">
            {all.map((it, i) => (
              <React.Fragment key={it.href}>
                <BreadcrumbItem>
                  {i === last ? (
                    <BreadcrumbPage className="text-primary-foreground">
                      {it.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={it.href}>{it.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {i !== last && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
