import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Program } from '@/types/programTypes';
import { Tabs } from '@/components/ui/tabs';
import ProgramPrimaryInfo from './detail/ProgramPrimaryInfo';
import ProgramSidebar from './detail/ProgramSidebar';
import ProgramTabs from './detail/ProgramTabs';
import ProgramTabContent from './detail/ProgramTabContent';

// 提取标签配置到常量
const PROGRAM_TABS = [
  { id: 'highlights', label_en: 'Highlights', label_zh: '亮点' },
  { id: 'itinerary', label_en: 'Itinerary', label_zh: '行程' },
  { id: 'features', label_en: 'Features', label_zh: '特色' },
  { id: 'info', label_en: 'Info', label_zh: '信息' },
  { id: 'gallery', label_en: 'Gallery', label_zh: '图片库' }
];

interface ProgramDetailContentProps {
  program: Program;
}

const ProgramDetailContent: React.FC<ProgramDetailContentProps> = ({ program }) => {
  const { currentLanguage } = useLanguage();
  const [imageIndex, setImageIndex] = useState(0);
  
  const title = currentLanguage === 'en' ? program.title_en : program.title_zh;
  const programImages = program.gallery_images 
    ? [program.image || "/placeholder.svg", ...program.gallery_images] 
    : [program.image || "/placeholder.svg"];
  
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">{title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <ProgramPrimaryInfo 
            program={program} 
            imageIndex={imageIndex} 
            setImageIndex={setImageIndex} 
          />
          <ProgramSidebar program={program} />
        </div>
        
        <Tabs defaultValue="highlights" className="w-full">
          <ProgramTabs programTabs={PROGRAM_TABS} />
          <ProgramTabContent program={program} programImages={programImages} />
        </Tabs>
      </div>
    </div>
  );
};

export default ProgramDetailContent;
