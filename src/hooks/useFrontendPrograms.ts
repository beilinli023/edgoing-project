
import { useProgramFilters } from './useProgramFilters';
import { useProgramData } from './useProgramData';
import { useProgramPagination } from './useProgramPagination';
import { useSupabaseConnection } from './useSupabaseConnection';

export const useFrontendPrograms = () => {
  const ITEMS_PER_PAGE = 4; // 每页显示4个项目
  
  // Connection status
  const { connectionStatus, connectionError } = useSupabaseConnection();
  
  // Filters
  const { selectedFilters, appliedFilters, removeFilter, clearAllFilters } = useProgramFilters();
  
  // Pagination
  const { currentPage, totalPages, totalItems, itemsPerPage, updateTotalPages, goToPage } = 
    useProgramPagination(ITEMS_PER_PAGE);
  
  // Data loading
  const { programs, totalCount, isLoading, error } = useProgramData(
    selectedFilters, 
    currentPage,
    ITEMS_PER_PAGE,
    connectionStatus
  );
  
  // Update total pages when total count changes
  if (totalCount !== totalItems) {
    updateTotalPages(totalCount);
  }

  return {
    // Data
    programs,
    isLoading,
    error: error || connectionError,
    
    // Pagination
    currentPage,
    totalPages,
    totalPrograms: totalCount,
    itemsPerPage: ITEMS_PER_PAGE,
    goToPage,
    
    // Filters
    appliedFilters,
    removeFilter,
    clearAllFilters,
    
    // Connection
    connectionStatus
  };
};
