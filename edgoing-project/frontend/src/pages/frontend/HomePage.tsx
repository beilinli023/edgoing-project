
import React from 'react';
import FrontendLayout from '@/components/frontend/FrontendLayout';
import HeroSlider from '@/components/frontend/home/HeroSlider';
import TaglineSection from '@/components/frontend/home/TaglineSection';
import FeaturedPrograms from '@/components/frontend/home/FeaturedPrograms';
import StudentStories from '@/components/frontend/home/StudentStories';
import WhyChoose from '@/components/frontend/home/WhyChoose';
import GraduationFeature from '@/components/frontend/home/GraduationFeature';
import PartnerLogos from '@/components/frontend/home/PartnerLogos';
import JourneyStart from '@/components/frontend/home/JourneyStart';
import NewsletterSubscription from '@/components/frontend/home/NewsletterSubscription';
import { useLanguage } from '@/context/LanguageContext';
import '@/components/frontend/home/customColors.css';

const HomePage = () => {
  const { currentLanguage } = useLanguage();

  return (
    <FrontendLayout>
      <HeroSlider currentLanguage={currentLanguage as 'en' | 'zh'} />
      <TaglineSection />
      <FeaturedPrograms currentLanguage={currentLanguage as 'en' | 'zh'} />
      <WhyChoose />
      <GraduationFeature />
      <PartnerLogos currentLanguage={currentLanguage as 'en' | 'zh'} />
      <StudentStories currentLanguage={currentLanguage as 'en' | 'zh'} />
      <NewsletterSubscription />
      <JourneyStart />
    </FrontendLayout>
  );
};

export default HomePage;
