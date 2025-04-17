
import React from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface ProgramsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalPrograms: number;
  itemsPerPage: number;
  programs: any[];
  goToPage: (page: number) => void;
}

const ProgramsPagination: React.FC<ProgramsPaginationProps> = ({
  currentPage,
  totalPages,
  totalPrograms,
  itemsPerPage,
  programs,
  goToPage
}) => {
  const { currentLanguage } = useLanguage();

  if (totalPages <= 0) {
    return null;
  }

  return (
    <div className="flex justify-center items-center mt-8 gap-2">
      <div className="text-sm text-gray-600 mr-4">
        {currentLanguage === 'en' 
          ? `Showing ${programs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to ${Math.min(currentPage * itemsPerPage, totalPrograms)} of ${totalPrograms} results` 
          : `显示第 ${programs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} 至 ${Math.min(currentPage * itemsPerPage, totalPrograms)} 项，共 ${totalPrograms} 项结果`}
      </div>
      
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md border disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      
      {/* 页码 */}
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const pageNum = i + 1;
        return (
          <button
            key={i}
            onClick={() => goToPage(pageNum)}
            className={`w-8 h-8 flex items-center justify-center rounded-md ${
              pageNum === currentPage 
                ? 'bg-blue-600 text-white' 
                : 'border hover:bg-gray-100'
            }`}
          >
            {pageNum}
          </button>
        );
      })}
      
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md border disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ProgramsPagination;
