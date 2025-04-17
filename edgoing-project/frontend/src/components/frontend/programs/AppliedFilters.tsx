
import React from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface AppliedFiltersProps {
  appliedFilters: Array<{
    type: string;
    value: string;
    label: string;
  }>;
  removeFilter: (type: string, value: string) => void;
  clearAllFilters: () => void;
}

const AppliedFilters: React.FC<AppliedFiltersProps> = ({ 
  appliedFilters, 
  removeFilter, 
  clearAllFilters 
}) => {
  const { currentLanguage } = useLanguage();

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">
          {currentLanguage === 'en' ? 'Applied Filters' : '已应用的筛选'}
        </span>
        <button 
          onClick={clearAllFilters}
          className="text-xs text-blue-600 hover:underline"
        >
          {currentLanguage === 'en' ? 'Clear All' : '清除全部'}
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {appliedFilters.map((filter, index) => (
          <Badge 
            key={index} 
            variant="outline"
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100"
          >
            <span>{filter.label}</span>
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => removeFilter(filter.type, filter.value)}
            />
          </Badge>
        ))}
        {appliedFilters.length === 0 && (
          <span className="text-gray-500 text-sm italic">
            {currentLanguage === 'en' ? 'No filters applied' : '未应用筛选'}
          </span>
        )}
      </div>
    </div>
  );
};

export default AppliedFilters;
