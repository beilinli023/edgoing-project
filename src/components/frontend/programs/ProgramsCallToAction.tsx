
import React from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

const ProgramsCallToAction: React.FC = () => {
  const { currentLanguage } = useLanguage();

  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-3xl font-bold mb-4">
          {currentLanguage === 'en' ? 'Ready to Start Your Journey?' : '准备开始您的旅程？'}
        </h2>
        <p className="max-w-2xl mx-auto mb-8">
          {currentLanguage === 'en' 
            ? 'Take the first step towards your international education adventure. Our team is here to help you find the perfect program.' 
            : '迈出国际教育冒险的第一步。我们的团队随时为您找到完美的项目提供帮助。'}
        </p>
        <Button 
          size="lg"
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          {currentLanguage === 'en' ? 'Let\'s Plan' : '开始计划'}
        </Button>
      </div>
    </section>
  );
};

export default ProgramsCallToAction;
