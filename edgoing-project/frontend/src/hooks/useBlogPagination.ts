
import { useState } from "react";

interface PaginationProps {
  totalPages: number;
  initialPage?: number;
}

export const useBlogPagination = ({ totalPages, initialPage = 1 }: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    currentPage,
    goToNextPage,
    goToPreviousPage,
    goToPage
  };
};
