
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const ProgramDetailLoading = () => {
  const { currentLanguage } = useLanguage();
  
  return (
    <div className="container mx-auto py-20 text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
      <p className="text-gray-600">
        {currentLanguage === 'en' ? 'Loading program details...' : '加载项目详情中...'}
      </p>
    </div>
  );
};

export default ProgramDetailLoading;
