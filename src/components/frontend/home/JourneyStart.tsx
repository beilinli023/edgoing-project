
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const JourneyStart = () => {
  const { currentLanguage } = useLanguage();
  
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">
          {currentLanguage === 'en' ? 'Ready to Start Your Journey?' : '准备开始您的旅程？'}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          {currentLanguage === 'en' 
            ? 'Take the first step towards your international education adventure. Our team is here to help you find the perfect program.'
            : '迈出国际教育冒险的第一步。我们的团队将帮助您找到完美的项目。'}
        </p>
        <Button asChild className="rounded-full px-8 bg-yellow-500 hover:bg-yellow-600 text-white">
          <Link to="/start-planning">
            {currentLanguage === 'en' ? 'Let\'s Plan' : '开始规划'}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default JourneyStart;
