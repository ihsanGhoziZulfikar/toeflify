'use client';

import FilterSidebar from '@/components/FilterSidebar';
import LessonCard from '@/components/LessonCard';
import Pagination from '@/components/Pagination';
import type { Section } from '@/lib/types';
import { Sparkles } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

interface Lesson {
  id: string;
  title: string;
  section: string;
  sectionSlug: string;
  chapter?: string;
  chapterSlug?: string;
  topic?: string;
  topicSlug?: string;
  href: string;
  imageSrc?: string;
}

interface LessonClientProps {
  filterData: Section[];
  lessons: Lesson[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
  activeFilters: {
    section?: string;
    chapter?: string;
    topic?: string;
    query?: string;
  };
}

const FALLBACK_IMAGE = '/assets/images/lessons.png';

export default function LessonClient({ filterData, lessons, pagination, activeFilters }: LessonClientProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [searchValue, setSearchValue] = useState(() => activeFilters.query ?? '');

  const buildUrl = useCallback((nextParams: URLSearchParams) => {
    const queryString = nextParams.toString();
    return queryString ? `/lessons?${queryString}` : '/lessons';
  }, []);

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      const newParams = new URLSearchParams(params.toString());
      if (value) newParams.set(key, value);
      else newParams.delete(key);

      if (key === 'section') {
        newParams.delete('chapter');
        newParams.delete('topic');
      } else if (key === 'chapter') {
        newParams.delete('topic');
      }

      newParams.delete('page');
      router.push(buildUrl(newParams));
    },
    [buildUrl, params, router]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const newParams = new URLSearchParams(params.toString());
      newParams.set('page', page.toString());
      router.push(buildUrl(newParams));
    },
    [buildUrl, params, router]
  );

  const handleSearch = useCallback(
    (value: string) => {
      const newParams = new URLSearchParams(params.toString());
      if (value) newParams.set('q', value);
      else newParams.delete('q');
      newParams.delete('page');
      router.push(buildUrl(newParams));
    },
    [buildUrl, params, router]
  );

  const resultsRange = useMemo(() => {
    if (!pagination.totalItems) {
      return { start: 0, end: 0 };
    }
    const start = (pagination.currentPage - 1) * pagination.pageSize + 1;
    const end = Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems);
    return { start, end };
  }, [pagination.currentPage, pagination.pageSize, pagination.totalItems]);

  const hasActiveFilters = useMemo(() => Boolean(activeFilters.section || activeFilters.chapter || activeFilters.topic || activeFilters.query), [activeFilters.chapter, activeFilters.query, activeFilters.section, activeFilters.topic]);

  const clearAllFilters = () => router.push('/lessons');

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50/60 via-white to-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <section className="rounded-3xl bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)] border border-blue-100 p-6 md:p-10 flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wide mb-4">
              <Sparkles size={18} />
              curated skills
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-rowdies leading-tight mb-4">Explore every TOEFL skill in one place</h1>
            <p className="text-gray-600 text-base md:text-lg font-saira">Browse structured lessons grouped by Section → Chapter → Topic. Use the filters and search to quickly find the exact skill you need to master next.</p>
          </div>
          <form
            className="bg-blue-50/60 rounded-2xl p-6 w-full lg:w-96 shadow-inner border border-blue-100 flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              handleSearch(searchValue.trim());
            }}
          >
            <label htmlFor="lesson-search" className="text-xs font-semibold uppercase text-blue-600 tracking-widest">
              Search skills
            </label>
            <input
              id="lesson-search"
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder='Try "Listening - Short Talks"'
              className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-primary text-white rounded-xl py-3 font-semibold shadow hover:bg-blue-500 transition-all cursor-pointer">
                Search
              </button>
              {searchValue && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchValue('');
                    handleSearch('');
                  }}
                  className="px-4 py-3 rounded-xl border border-blue-200 text-sm font-semibold text-gray-600 hover:text-primary transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            {hasActiveFilters && (
              <button type="button" className="text-xs text-blue-600 mt-2 underline" onClick={clearAllFilters}>
                Reset filters
              </button>
            )}
          </form>
        </section>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-80 shrink-0">
            <FilterSidebar
              filterData={filterData}
              onFilterChange={handleFilterChange}
              selectedFilters={{
                section: activeFilters.section ?? null,
                chapter: activeFilters.chapter ?? null,
                topic: activeFilters.topic ?? null,
              }}
            />
            {hasActiveFilters && (
              <button type="button" onClick={clearAllFilters} className="mt-4 w-full text-sm font-semibold text-primary hover:text-blue-600 transition-colors">
                Clear all filters
              </button>
            )}
          </aside>

          <main className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Results</p>
                <p className="text-lg font-bold text-gray-900">
                  Showing {resultsRange.start}-{resultsRange.end} of {pagination.totalItems} skills
                </p>
              </div>
            </div>

            {lessons.length ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {lessons.map((lesson) => (
                    <LessonCard key={lesson.id} title={lesson.title} section={lesson.section} chapter={lesson.chapter} topic={lesson.topic} href={lesson.href} imageSrc={lesson.imageSrc ?? FALLBACK_IMAGE} />
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <Pagination page={pagination.currentPage} totalPages={pagination.totalPages} hasNext={pagination.currentPage < pagination.totalPages} hasPrev={pagination.currentPage > 1} onPageChange={handlePageChange} />
                )}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-blue-200 bg-blue-50/40 p-12 text-center text-gray-500">
                <p className="text-lg font-semibold text-gray-700 mb-2">No skills match your filters yet.</p>
                <p className="text-sm text-gray-500">Try adjusting the filters or search for a different keyword.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
