
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface FilterSkeletonProps {
  categories: { [key: string]: { en: string; zh: string } };
}

const FilterSkeleton: React.FC<FilterSkeletonProps> = ({ categories }) => {
  const { currentLanguage } = useLanguage();
  
  return (
    <div className="space-y-5">
      <div className="text-sm text-blue-600 mb-3">
        {currentLanguage === 'en' ? 'Loading Filters...' : '加载筛选项...'}
      </div>
      {/* 加载骨架屏 */}
      {Object.keys(categories).map(key => (
        <div key={key} className="border rounded-md animate-pulse">
          <div className="h-10 bg-gray-200"></div>
          <div className="p-4 border-t">
            <div className="space-y-2">
              {[1, 2, 3].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilterSkeleton;
