
import React from 'react';
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from '@/context/LanguageContext';

interface FilterSectionProps {
  title: {
    en: string;
    zh: string;
  };
  isExpanded: boolean;
  toggleExpanded: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  isExpanded,
  toggleExpanded,
  isLoading = false,
  children
}) => {
  const { currentLanguage } = useLanguage();
  
  return (
    <div className="border rounded-md">
      {/* 过滤器部分头部 */}
      <button 
        onClick={toggleExpanded}
        className="flex justify-between items-center w-full px-4 py-2 text-left font-medium"
      >
        <span>{currentLanguage === 'en' ? title.en : title.zh}</span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      
      {/* 过滤器选项 */}
      {isExpanded && (
        <div className="px-4 py-2 border-t">
          <div className="space-y-2">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;
