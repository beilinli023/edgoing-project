
import React from 'react';
import { useParams } from 'react-router-dom';
import FrontendLayout from '@/components/frontend/FrontendLayout';
import UniversityDetailHero from '@/components/frontend/universities/UniversityDetailHero';
import UniversityDetailContent from '@/components/frontend/universities/UniversityDetailContent';
import { useLanguage } from '@/context/LanguageContext';
import { useFrontendUniversityDetail } from '@/hooks/useFrontendUniversityDetail';

const UniversityDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { currentLanguage } = useLanguage();

  // 直接使用URL中传入的ID
  const numericId = id ? parseInt(id, 10) : 1; // 如果没有ID，默认使用ID 1

  console.log(`University detail page for ID: ${numericId}, language: ${currentLanguage}`);

  const { university, isLoading, error } = useFrontendUniversityDetail(
    numericId,
    currentLanguage as 'en' | 'zh'
  );

  if (isLoading) {
    return (
      <FrontendLayout>
        <div className="container mx-auto py-20 text-center">
          <div className="h-24 w-24 rounded-full border-4 border-t-blue-600 border-b-blue-600 border-l-transparent border-r-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">{currentLanguage === 'en' ? 'Loading university details...' : '正在加载大学详情...'}</p>
        </div>
      </FrontendLayout>
    );
  }

  if (error || !university) {
    return (
      <FrontendLayout>
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {currentLanguage === 'en' ? 'University Not Found' : '未找到大学'}
          </h1>
          <p className="text-gray-600">
            {currentLanguage === 'en'
              ? 'Sorry, the university you are looking for does not exist or could not be loaded.'
              : '抱歉，您查找的大学不存在或无法加载。'
            }
          </p>
        </div>
      </FrontendLayout>
    );
  }

  return (
    <FrontendLayout>
      <UniversityDetailHero university={university} />
      <UniversityDetailContent university={university} />
    </FrontendLayout>
  );
};

export default UniversityDetailPage;
