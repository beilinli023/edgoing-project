import React from 'react';
import { Program } from '@/types/programTypes';
import ProgramCard from './ProgramCard';
import { useProgramOrdering } from '@/hooks/useProgramOrdering';
import { useLanguage } from '@/context/LanguageContext';

// 骨架屏数量常量
const SKELETON_COUNT = 4;

interface ProgramListSectionProps {
  programs: Program[];
  isLoading: boolean;
  error?: string | null;
}

const ProgramListSection: React.FC<ProgramListSectionProps> = ({ programs, isLoading, error }) => {
  const { orderedPrograms } = useProgramOrdering(programs);
  const { currentLanguage } = useLanguage();
  
  // 多语言文本
  const texts = {
    errorLoading: currentLanguage === 'en' ? 'Error loading programs' : '加载项目时出错',
    noPrograms: currentLanguage === 'en' ? 'No programs found' : '没有找到符合条件的项目',
    adjustFilters: currentLanguage === 'en' 
      ? 'Try adjusting your filters or clearing all filter conditions' 
      : '请尝试调整过滤器或清除所有过滤条件'
  };
  
  // 加载状态
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg h-[350px] animate-pulse"></div>
        ))}
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow-sm p-6">
        <p className="text-xl text-red-500">{texts.errorLoading}</p>
        <p className="text-gray-500 mt-2">{error}</p>
      </div>
    );
  }

  // 无结果状态
  if (orderedPrograms.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow-sm p-6">
        <p className="text-xl text-gray-500">{texts.noPrograms}</p>
        <p className="text-gray-400 mt-2">{texts.adjustFilters}</p>
      </div>
    );
  }

  // 正常显示状态
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {orderedPrograms.map((program) => (
        <ProgramCard key={program.id} program={program} />
      ))}
    </div>
  );
};

export default ProgramListSection;
