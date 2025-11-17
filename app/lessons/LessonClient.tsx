'use client';

import FilterSidebar from '@/components/FilterSidebar';
import LessonCard from '@/components/LessonCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Pagination from '@/components/Pagination';

interface Lesson {
  id: string;
  title: string;
  section: string;
  imageSrc: string;
  href: string;
}

type Metadata = {
  total: number;
  page: number;
  size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
};

// interface PaginationProps {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
//   const renderPageNumbers = () => {
//     const pages = [];
//     const maxVisible = 5;

//     if (totalPages <= maxVisible) {
//       // Show all pages if total is small
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       // Show first page
//       pages.push(1);

//       if (currentPage > 3) {
//         pages.push('...');
//       }

//       // Show pages around current
//       for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
//         if (!pages.includes(i)) {
//           pages.push(i);
//         }
//       }

//       if (currentPage < totalPages - 2) {
//         pages.push('...');
//       }

//       // Show last page
//       if (!pages.includes(totalPages)) {
//         pages.push(totalPages);
//       }
//     }

//     return pages;
//   };

//   return (
//     <div className="flex items-center justify-center gap-2 mt-8 mb-4">
//       {/* Previous Button */}
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         className={`p-2 rounded-md transition-colors ${
//           currentPage === 1
//             ? 'text-gray-300 cursor-not-allowed'
//             : 'text-gray-600 hover:bg-gray-100'
//         }`}
//       >
//         <ChevronLeft size={20} />
//       </button>

//       {/* Page Numbers */}
//       {renderPageNumbers().map((page, index) => (
//         <button
//           key={index}
//           onClick={() => typeof page === 'number' && onPageChange(page)}
//           disabled={page === '...'}
//           className={`min-w-[40px] h-[40px] rounded-md transition-colors ${
//             page === currentPage
//               ? 'bg-gray-900 text-white font-semibold'
//               : page === '...'
//               ? 'text-gray-400 cursor-default'
//               : 'text-gray-600 hover:bg-gray-100'
//           }`}
//         >
//           {page}
//         </button>
//       ))}

//       {/* Next Button */}
//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         className={`p-2 rounded-md transition-colors ${
//           currentPage === totalPages
//             ? 'text-gray-300 cursor-not-allowed'
//             : 'text-gray-600 hover:bg-gray-100'
//         }`}
//       >
//         <ChevronRight size={20} />
//       </button>
//     </div>
//   );
// }

export default function LessonClient({
  filterData,
  lessons,
  currentPage,
  totalPages
}: {
  filterData: any;
  lessons: Lesson[];
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const params = useSearchParams();

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(params.toString());

    if (value) newParams.set(key, value);
    else newParams.delete(key);

    // Reset dependent filters and page
    if (key === 'section') {
      newParams.delete('chapter');
      newParams.delete('topic');
    } else if (key === 'chapter') {
      newParams.delete('topic');
    }

    // Reset to page 1 when filters change
    newParams.delete('page');

    router.push(`/lessons?${newParams.toString()}`);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set('page', page.toString());
    router.push(`/lessons?${newParams.toString()}`);
  };

  const metadata: Metadata = {
      total: 20,
      page: 1,
      size: 5,
      total_pages: 4,
      has_next: true,
      has_prev: false,
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Filters */}
      <div className="m-5">
        <FilterSidebar filterData={filterData} onFilterChange={handleFilterChange} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 pr-10">
        {lessons.length > 0 ? (
          <>
            {/* Grid of Lesson Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  title={lesson.title}
                  section={lesson.section}
                  imageSrc={lesson.imageSrc}
                  href={lesson.href}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              // <Pagination
              //   currentPage={currentPage}
              //   totalPages={totalPages}
              //   onPageChange={handlePageChange}
              // />
              <Pagination
                page={metadata.page}
                totalPages={metadata.total_pages}
                hasNext={metadata.has_next}
                hasPrev={metadata.has_prev}
                onPageChange={()=>{}}
              />
            )}
          </>
        ) : (
          <div className="text-gray-500 text-center mt-10">No lessons found.</div>
        )}
      </div>
    </div>
  );
}
