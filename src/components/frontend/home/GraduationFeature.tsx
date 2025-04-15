import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Users, GraduationCap, Home, Clock, Globe, Shield } from 'lucide-react';

const GraduationFeature = () => {
  const { currentLanguage } = useLanguage();
  
  // 初始值设为true，确保一开始就能看到动画效果
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    // 组件挂载后立即设置为不可见状态，然后通过延迟来触发动画
    setIsVisible(false);
    
    // 短暂延迟后触发显示动画
    const timer = setTimeout(() => {
      setIsVisible(true);
      setHasAnimated(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const title = currentLanguage === 'en' ? 'Student Support and Safety' : '学生支持与安全';
  const subtitle = currentLanguage === 'en' 
    ? 'We prioritize your well-being, and our comprehensive education system provides all-round support services.'
    : '我们优先考虑您的健康，在您的教育旅程中全天候提供全面的支持服务。';

  const features = [
    {
      icon: Users,
      title: currentLanguage === 'en' ? 'Experienced Leadership Team' : '经验丰富的领导团队',
      description: currentLanguage === 'en' 
        ? '5+ years of experience with the ability to handle difficult situations and team management, supporting students 1:15 ratio.'
        : '5年以上领导经验，应急处理能力强、清晰的行动指南和1:15的师生比例，提供个性化支持。'
    },
    {
      icon: GraduationCap,
      title: currentLanguage === 'en' ? 'High-Quality Education Programs' : '高质量教育项目',
      description: currentLanguage === 'en'
        ? 'Partnerships with renowned universities and government-accredited cooperation programs.'
        : '由专家主导的课程，与政府推荐的合作伙伴合作，提供可信赖。'
    },
    {
      icon: Home,
      title: currentLanguage === 'en' ? 'Safe Housing and Healthy Dining' : '安全住宿和健康餐饮',
      description: currentLanguage === 'en'
        ? 'Safe living environment, strict safety measures, and nutritionally balanced meals meeting dietary preferences.'
        : '安全的住宿环境，严格的安全措施，以及适合各种饮食需求的营养均衡餐食。'
    },
    {
      icon: Clock,
      title: currentLanguage === 'en' ? 'Around-the-Clock Support' : '全天候支持',
      description: currentLanguage === 'en'
        ? '24/7 assistance for students whenever needed.'
        : '全天候服务，为学生提供持续支持。'
    },
    {
      icon: Globe,
      title: currentLanguage === 'en' ? 'Immersive Cultural Experience' : '沉浸式文化体验',
      description: currentLanguage === 'en'
        ? 'Interactive activities, excursions and volunteer opportunities that facilitate learning.'
        : '互动活动、输入丰富的游览和当地参与，促进深度学习。'
    },
    {
      icon: Shield,
      title: currentLanguage === 'en' ? 'Recognized Academic Excellence' : '受认可的学术卓越',
      description: currentLanguage === 'en'
        ? 'Assistance with applications to prestigious universities.'
        : '旨在提高学术表现和未来大学申请的课程。'
    }
  ];
  
  return (
    <div className="py-10 relative overflow-hidden" style={{
      backgroundImage: 'url(/Edgoing/Home_Page/Support1.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundBlendMode: 'normal',
    }}>
      {/* 添加轻微的透明遮罩层 */}
      <div className="absolute inset-0 bg-[#f0edd7] opacity-25 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* 标题部分 - 添加更明显的动画效果 */}
        <div 
          className={`text-center mb-6 transition-all duration-1200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <h2 className="text-3xl font-bold mb-2 text-white drop-shadow-md">{title}</h2>
          <p className="text-white max-w-3xl mx-auto drop-shadow-md">{subtitle}</p>
        </div>
        
        {/* 主内容区域 - 特性网格 */}
        <div className="max-w-5xl mx-auto relative">
          {/* 卡片区域 - 更明显的动画效果 */}
          <div 
            className={`bg-[#d4dbbb]/80 backdrop-blur-md rounded-2xl p-6 shadow-lg transition-all duration-1000 transform ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            } hover:shadow-xl hover:scale-[1.01] transition-all duration-500`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`flex items-start transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                  }`} 
                  style={{ transitionDelay: `${300 + (index * 150)}ms` }}
                >
                  <div className="bg-[#73835A] p-2 rounded-full mr-3 flex items-center justify-center flex-shrink-0 h-10 w-10 transition-all hover:scale-125 hover:rotate-12 duration-300">
                    {React.createElement(feature.icon, { size: 20, className: "text-white" })}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-800 mb-1">{feature.title}</h4>
                    <p className="text-xs text-gray-600 leading-tight">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 添加动画重播按钮（仅在动画已播放过一次后显示） */}
      {hasAnimated && (
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => setIsVisible(true), 10);
          }}
          className="absolute bottom-4 right-4 bg-[#73835A] text-white rounded-full p-2 text-xs shadow-md hover:bg-[#5f6c4a] transition-colors"
        >
          {/* 移除了按钮文本 */}
        </button>
      )}
    </div>
  );
};

export default GraduationFeature;
