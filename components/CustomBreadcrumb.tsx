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
import { toTitleCase } from '@/lib/helper';

export type BreadcrumbItemType = {
  label: string;
  href: string;
};

export default function CustomBreadcrumb({
  items,
}: {
  items: BreadcrumbItemType[];
}) {
  if (!items || items.length === 0) {
    return null;
  }

  const last = items.length - 1;

  return (
    <div className="w-full bg-[rgba(65,160,229,0.65)] backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-2">
        <Breadcrumb>
          <BreadcrumbList className="text-primary-foreground">
            {items.map((it, i) => (
              <React.Fragment key={it.href}>
                <BreadcrumbItem>
                  {i === last ? (
                    <BreadcrumbPage className="text-primary-foreground">
                      {toTitleCase(it.label)}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        href={it.href}
                        className="hover:underline hover:text-white"
                      >
                        {toTitleCase(it.label)}
                      </Link>
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
