import React from 'react';

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  disablePrevious?: boolean;
  disableNext?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  onPageChange,
  disablePrevious = currentPage === 1,
  disableNext = false,
}) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        disabled={disablePrevious}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded bg-gray-800 px-3 py-1 hover:bg-gray-700 disabled:opacity-50"
      >
        Prev
      </button>
      <span className="text-gray-300">Page {currentPage}</span>
      <button
        disabled={disableNext}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded bg-gray-800 px-3 py-1 hover:bg-gray-700 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};
