import React from 'react';
import FrontendLayout from '@/components/frontend/FrontendLayout';
import { useLanguage } from '@/context/LanguageContext';
import { useFrontendStudyAbroad } from '@/hooks/useFrontendStudyAbroad';
import PartnerUniversitiesSection from '@/components/frontend/study-abroad/PartnerUniversitiesSection';
import BenefitsSection from '@/components/frontend/study-abroad/BenefitsSection';
import StudyAbroadHero from '@/components/frontend/study-abroad/StudyAbroadHero';

const StudyAbroadPage = () => {
  const { currentLanguage } = useLanguage();
  const { content, isLoading, error } = useFrontendStudyAbroad(currentLanguage as 'en' | 'zh');

  // 更新标题和描述文本
  const title = currentLanguage === 'en'
    ? 'Study Abroad: Expand Your Horizons'
    : '留学：拓展你的视野';

  const description = currentLanguage === 'en'
    ? 'Embark on a life-changing study abroad journey to explore new cultures, gain a global perspective, and enhance your education. Whether you seek academic excellence, language immersion, or unforgettable experiences, studying abroad opens doors to endless opportunities'
    : '踏上改变人生的留学之旅，探索新文化，获得全球视野，并提升你的教育水平。无论你追求学术卓越、语言深浸还是难忘的经历，留学都将为你打开无限机遇的大门';

  if (isLoading) {
    return (
      <FrontendLayout>
        <div className="container mx-auto py-20 text-center">
          <div className="h-24 w-24 rounded-full border-4 border-t-blue-600 border-b-blue-600 border-l-transparent border-r-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">
            {currentLanguage === 'en' ? 'Loading content...' : '正在加载内容...'}
          </p>
        </div>
      </FrontendLayout>
    );
  }

  if (error) {
    return (
      <FrontendLayout>
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {currentLanguage === 'en' ? 'Error Loading Content' : '加载内容出错'}
          </h1>
          <p className="text-gray-600">
            {currentLanguage === 'en'
              ? 'Sorry, we couldn\'t load the study abroad information.'
              : '抱歉，我们无法加载留学信息。'
            }
          </p>
        </div>
      </FrontendLayout>
    );
  }

  if (!content) {
    return (
      <FrontendLayout>
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {currentLanguage === 'en' ? 'No Content Available' : '无可用内容'}
          </h1>
          <p className="text-gray-600">
            {currentLanguage === 'en'
              ? 'Study abroad program information is currently unavailable.'
              : '留学项目信息当前不可用。'
            }
          </p>
        </div>
      </FrontendLayout>
    );
  }

  return (
    <FrontendLayout>
      <StudyAbroadHero />

      {/* Benefits Section */}
      <BenefitsSection benefits={content.benefits} />

      {/* Partner Universities Section */}
      <PartnerUniversitiesSection universities={content.universities} />

      {/* Call to Action Section - Could be implemented separately */}
    </FrontendLayout>
  );
};

export default StudyAbroadPage;
