
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProgramTabsProps {
  programTabs: {
    id: string;
    label_en: string;
    label_zh: string;
  }[];
}

const ProgramTabs: React.FC<ProgramTabsProps> = ({ programTabs }) => {
  const { currentLanguage } = useLanguage();
  
  return (
    <TabsList className="mb-8 border-b w-full justify-start bg-transparent h-auto p-0 space-x-4">
      {programTabs.map(tab => (
        <TabsTrigger 
          key={tab.id}
          value={tab.id}
          className="px-3 py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 data-[state=active]:bg-transparent rounded-none border-transparent bg-transparent text-gray-600 hover:text-blue-700 transition-colors"
        >
          {currentLanguage === 'en' ? tab.label_en : tab.label_zh}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default ProgramTabs;
