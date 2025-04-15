
import React from 'react';
import { useFrontendPrograms } from "@/hooks/useFrontendPrograms";
import ProgramFilterSidebar from "./ProgramFilterSidebar";
import ProgramListSection from "./ProgramListSection";
import ProgramsPagination from "./ProgramsPagination";

const ProgramsContent: React.FC = () => {
  const {
    programs,
    totalPrograms,
    currentPage,
    totalPages,
    itemsPerPage,
    appliedFilters,
    removeFilter,
    clearAllFilters,
    goToPage,
    isLoading,
    error
  } = useFrontendPrograms();

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar - Filters */}
        <ProgramFilterSidebar 
          appliedFilters={appliedFilters}
          removeFilter={removeFilter}
          clearAllFilters={clearAllFilters}
        />
        
        {/* Right - Program Cards */}
        <div className="flex-1">
          <ProgramListSection 
            programs={programs}
            isLoading={isLoading}
            error={error}
          />
          
          {/* Pagination */}
          <ProgramsPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            totalPrograms={totalPrograms}
            itemsPerPage={itemsPerPage}
            programs={programs}
            goToPage={goToPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgramsContent;
