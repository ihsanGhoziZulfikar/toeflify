'use client';

import ProfileDropdown from '@/components/ProfileDropdown';
import { useRouter } from 'next/navigation';
import SkeletonList from '@/components/ui/SkeletonList';
import Pagination from '@/components/Pagination';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useState } from 'react';

type HistoryItem = {
  id: string;
  quiz_title: string;
  completed_at: string;
  score: number;
};

type Metadata = {
  total: number;
  page: number;
  size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
};

export default function HistoryPage() {
  const router = useRouter();

  const [page, setPage] = useState(1);

  // SWR fetch with cache per page
  const { data, error, isLoading } = useSWR(
    `/api/quiz/history?size=7&page=${page}`,
    fetcher,
    {
      // revalidateOnMount: false,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
      dedupingInterval: 1000 * 60 * 10,
    }
  );

  const histories: HistoryItem[] = data?.data?.histories || [];
  const metadata: Metadata | null = data?.metadata || null;

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  return (
    <div className="min-h-screen py-10 flex justify-center w-full">
      <div className="flex gap-5 w-full max-w-6xl mx-auto">
        <div>
          <ProfileDropdown />
        </div>

        <div className="w-full mx-5">
          {/* Header */}

          <div className="w-full max-w-4xl mb-8">
            <h1 className="text-3xl font-rowdies text-primary">History</h1>
            <div className="mt-2 h-[2px] bg-primary/60"></div>
          </div>

          {/* History List */}
          <div className="w-full max-w-4xl bg-white flex flex-col min-h-[500px] p-2">
            {/* Header row */}
            <div className="flex items-center justify-between text-xl mb-4">
              <h2 className="font-saira font-semibold">Task</h2>
              <h2 className="font-saira font-semibold">Score</h2>
            </div>

            {/* List content */}
            <div className="flex-1">
              {isLoading ? (
                <SkeletonList />
              ) : histories.length > 0 ? (
                histories.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => router.push(`/quiz/review/${item.id}`)}
                    className="flex items-center justify-between border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-100 p-3 pr-5"
                  >
                    <div>
                      <h2 className="font-saira text-gray-800">
                        {item.quiz_title}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {formatDate(item.completed_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-lg ${
                          item.score > 0 ? 'text-green-700' : 'text-red-700'
                        }`}
                      >
                        {item.score}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No histories available.</p>
              )}
            </div>

            {/* Bottom right pagination */}
            <div className="flex justify-center mt-4">
              {metadata && (
                <Pagination
                  page={metadata.page}
                  totalPages={metadata.total_pages}
                  hasNext={metadata.has_next}
                  hasPrev={metadata.has_prev}
                  onPageChange={(p) => setPage(p)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
