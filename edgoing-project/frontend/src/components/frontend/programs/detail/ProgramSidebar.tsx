import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Program } from '@/types/programTypes';

// 多语言文本配置
const TEXT = {
  en: {
    programDetails: 'Program Details',
    location: 'Location',
    duration: 'Duration',
    gradeLevels: 'Grade Levels',
    price: 'Price',
    allGrades: 'All grades',
    notAvailable: 'N/A'
  },
  zh: {
    programDetails: '项目详情',
    location: '地点',
    duration: '时长',
    gradeLevels: '适用年级',
    price: '价格',
    allGrades: '所有年级',
    notAvailable: '暂无'
  }
};

// 信息项组件，用于减少重复代码
interface InfoItemProps {
  label: string;
  value: string | React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500 mb-0.5">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

interface ProgramSidebarProps {
  program: Program;
}

const ProgramSidebar: React.FC<ProgramSidebarProps> = ({ program }) => {
  const { currentLanguage } = useLanguage();
  const t = TEXT[currentLanguage as keyof typeof TEXT];
  
  // 获取当前语言的内容
  const location = currentLanguage === 'en' ? program.location_en : program.location_zh;
  const duration = currentLanguage === 'en' ? program.duration_en : program.duration_zh || program.duration; // 兼容旧数据
  
  // 格式化年级列表
  const gradeLevels = program.grade_levels && program.grade_levels.length > 0 
    ? program.grade_levels.join(', ') 
    : t.allGrades;
    
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-fit">
      <h3 className="text-xl font-semibold mb-3">{t.programDetails}</h3>
      
      <div className="space-y-2">
        <InfoItem label={t.location} value={location || t.notAvailable} />
        <InfoItem label={t.duration} value={duration || t.notAvailable} />
        <InfoItem label={t.gradeLevels} value={gradeLevels} />
        
        {program.price && (
          <InfoItem 
            label={t.price} 
            value={<span className="text-blue-700">{program.price}</span>} 
          />
        )}
      </div>
    </div>
  );
};

export default ProgramSidebar;
