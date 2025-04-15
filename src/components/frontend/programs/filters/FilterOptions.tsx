
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

// 空的过滤选项组件 - 准备重新实现
const FilterOptions: React.FC = () => {
  const { currentLanguage } = useLanguage();
  
  return (
    <div className="text-sm text-gray-500">
      {currentLanguage === 'en' ? 'Filter options will be implemented' : '过滤选项将被重新实现'}
    </div>
  );
};

export default FilterOptions;
