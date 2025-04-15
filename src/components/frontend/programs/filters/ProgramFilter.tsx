
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import FilterSection from './FilterSection';
import FilterOptions from './FilterOptions';

// 空的程序过滤器组件 - 准备重新实现
const ProgramFilter: React.FC = () => {
  const { currentLanguage } = useLanguage();
  
  return (
    <div className="space-y-5">
      <div className="text-sm text-blue-600 mb-3">
        {currentLanguage === 'en' ? 'Filter Programs' : '筛选项目'}
      </div>
      
      <FilterSection
        title={{en: 'Categories', zh: '分类'}}
        isExpanded={true}
        toggleExpanded={() => {}}
      >
        <FilterOptions />
      </FilterSection>
    </div>
  );
};

export default ProgramFilter;
