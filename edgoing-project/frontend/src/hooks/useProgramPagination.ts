
import { useState } from 'react';

export const useProgramPagination = (itemsPerPage: number = 4) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const updateTotalPages = (totalCount: number) => {
    setTotalItems(totalCount);
    setTotalPages(Math.ceil(totalCount / itemsPerPage));
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    updateTotalPages,
    goToPage
  };
};
