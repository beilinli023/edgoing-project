import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { StudyAbroadBenefit } from '@/types/studyAbroadTypes';
import { Lightbulb, Award, BookOpen, Globe, GraduationCap, Users, BookMarked, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BenefitsSectionProps {
  benefits: StudyAbroadBenefit[];
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ benefits }) => {
  const { currentLanguage } = useLanguage();
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'lightbulb': return <Lightbulb className="h-8 w-8 text-blue-500" />;
      case 'award': return <Award className="h-8 w-8 text-blue-500" />;
      case 'book': return <BookOpen className="h-8 w-8 text-blue-500" />;
      case 'globe': return <Globe className="h-8 w-8 text-blue-500" />;
      case 'graduation': return <GraduationCap className="h-8 w-8 text-blue-500" />;
      case 'users': return <Users className="h-8 w-8 text-blue-500" />;
      case 'book-marked': return <BookMarked className="h-8 w-8 text-blue-500" />;
      case 'file-text': return <FileText className="h-8 w-8 text-blue-500" />;
      default: return <Lightbulb className="h-8 w-8 text-blue-500" />;
    }
  };

  const defaultBenefits: StudyAbroadBenefit[] = benefits && benefits.length >= 4 ? benefits.slice(0, 4) : [
    {
      icon: 'globe',
      title_en: 'World-Class Universities',
      title_zh: '世界一流大学',
      description_en: 'Collaborate with renowned institutions across the globe, including Ivy League schools and top European and Asian universities.',
      description_zh: '与全球知名学府合作，包括常春藤名校、欧洲顶尖大学和亚洲优秀学府'
    },
    {
      icon: 'graduation',
      title_en: 'Academic Excellence',
      title_zh: '学术卓越',
      description_en: 'Access to world-class educational institutions and prestigious programs abroad.',
      description_zh: '获得世界一流教育机构和海外知名项目的学习机会'
    },
    {
      icon: 'award',
      title_en: 'Career Advancement',
      title_zh: '职业发展',
      description_en: 'Enhance your resume with international experiences that employers value highly.',
      description_zh: '通过雇主高度重视的国际经验提升您的简历'
    },
    {
      icon: 'lightbulb',
      title_en: 'Personal Growth',
      title_zh: '个人成长',
      description_en: 'Develop independence, adaptability and resilience through studying abroad.',
      description_zh: '通过留学培养独立性、适应能力和韧性'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-8 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">
            {currentLanguage === 'en' ? 'Benefits of Studying Abroad' : '留学的优势'}
          </h2>
          <p className="text-lg text-gray-800 max-w-3xl mx-auto">
            {currentLanguage === 'en' 
              ? 'Discover how international education can transform your future' 
              : '了解国际教育如何改变您的未来'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {defaultBenefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center text-center max-w-[380px] mx-auto h-[280px] justify-between"
            >
              <div className="mt-2">
                {getIconComponent(benefit.icon)}
              </div>
              <div className="flex-1 flex flex-col justify-center py-4">
                <h3 className="text-lg font-bold mb-3">
                  {currentLanguage === 'en' ? benefit.title_en : benefit.title_zh}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {currentLanguage === 'en' ? benefit.description_en : benefit.description_zh}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
