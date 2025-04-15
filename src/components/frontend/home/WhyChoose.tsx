import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const WhyChoose = () => {
  const { currentLanguage } = useLanguage();
  
  const features = [
    {
      title: currentLanguage === 'en' ? 'Expertise & Experience' : '专业知识与经验',
      description: currentLanguage === 'en' 
        ? 'With a foundation rooted in global expertise and a dedication to meticulous research, EdGoing crafts the highest quality, transformative educational programs that inspire students to learn beyond the classroom.'
        : 'EdGoing 植根于全球专业知识，致力于严谨的研究，精心打造最高品质、变革性的教育项目，激励学生在课堂之外学习。'
    },
    {
      title: currentLanguage === 'en' ? 'Global Perspectives' : '全球视野',
      description: currentLanguage === 'en'
        ? 'Through strategic global partnerships, EdGoing creates authentic cultural exchanges that empower students to become informed, empathetic, and globally connected leaders of tomorrow.'
        : '通过战略性的全球合作伙伴关系，EdGoing 创造了真实的文化交流，使学生成为见多识广、富有同理心且具有全球视野的未来领导者。'
    },
    {
      title: currentLanguage === 'en' ? 'Commitment to Safety and Personalization' : '安全与个性化承诺',
      description: currentLanguage === 'en'
        ? 'EdGoing designs safe, high-quality, and personalized journeys that equip students with lifelong skills and transformative global perspectives.'
        : 'EdGoing 设计安全、高品质且个性化的旅程，帮助学生掌握终身技能并获得变革性的全球视野。'
    }
  ];

  return (
    <div className="py-16 bg-slate-50">
      <div className="container mx-auto px-8 md:px-12">
        <h2 className="text-3xl font-bold text-center mb-3">
          {currentLanguage === 'en' ? (
            <>Why Choose <span className="text-blue-600">Ed</span><span className="text-yellow-500">Going</span></>
          ) : (
            <>为什么选择 <span className="text-blue-600">Ed</span><span className="text-yellow-500">Going</span></>
          )}
        </h2>
        <p className="text-center text-gray-600 mb-12">
          {currentLanguage === 'en' 
            ? 'Inspires global minds with transformative, safe, and personalized journeys trusted worldwide'
            : '以变革性、安全和个性化的旅程激发全球思维，获得全球信赖'}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChoose;
