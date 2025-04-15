
import React from 'react';
import { useLanguage } from "@/context/LanguageContext";
import ProgramFilter from "@/components/frontend/programs/filters/ProgramFilter";
import AppliedFilters from "@/components/frontend/programs/AppliedFilters";

interface ProgramFilterSidebarProps {
  appliedFilters: Array<{
    type: string;
    value: string;
    label: string;
  }>;
  removeFilter: (type: string, value: string) => void;
  clearAllFilters: () => void;
}

const ProgramFilterSidebar: React.FC<ProgramFilterSidebarProps> = ({
  appliedFilters,
  removeFilter,
  clearAllFilters
}) => {
  const { currentLanguage } = useLanguage();

  return (
    <div className="w-full md:w-64 shrink-0">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">
          {currentLanguage === 'en' ? 'Filter Results' : '筛选结果'}
        </h2>
        
        {/* Applied filters */}
        <AppliedFilters 
          appliedFilters={appliedFilters} 
          removeFilter={removeFilter} 
          clearAllFilters={clearAllFilters} 
        />
        
        {/* Filter categories */}
        <ProgramFilter />
      </div>
    </div>
  );
};

export default ProgramFilterSidebar;
