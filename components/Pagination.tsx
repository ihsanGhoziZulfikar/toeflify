"use client";
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
}: PaginationProps) {
    const renderPageNumbers = () => {
    const pages = [];
    const MAX_VISIBLE = 5;

    if (totalPages <= MAX_VISIBLE) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (page > 3) {
        pages.push('...');
      }

      // Show pages around current
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (page < totalPages - 2) {
        pages.push('...');
      }

      // Show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-3 mt-6 select-none">
      {/* Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrev}
        className={`p-2 rounded-md transition-colors  ${
          hasPrev
            ? 'text-gray-600 hover:bg-gray-100 cursor-pointer'
            : 'text-gray-300 cursor-not-allowed'
        }`}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Page indicator */}
      {renderPageNumbers().map((_page, index) => (
        <button
          key={index}
          onClick={() => typeof _page === 'number' && onPageChange(_page)}
          disabled={_page === '...'}
          className={`min-w-[40px] h-[40px] rounded-md transition-colors ${
            _page === page
              ? 'bg-primary text-white font-semibold'
              : _page === '...'
              ? 'text-gray-400 cursor-default'
              : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
          }`}
        >
          {_page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext}
        className={`p-2 rounded-md transition-colors ${
          hasNext
            ? 'text-gray-600 hover:bg-gray-100 cursor-pointer'
            : 'text-gray-300 cursor-not-allowed'
        }`}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}