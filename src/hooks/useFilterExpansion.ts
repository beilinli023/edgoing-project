
import { useState } from 'react';

export const useFilterExpansion = (initialState: Record<string, boolean> = {}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(initialState);
  
  // 切换展开状态
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  return {
    expandedSections,
    toggleSection
  };
};
