import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Loader2 } from 'lucide-react';
import { usePartnerLogos } from '@/hooks/usePartnerLogos';
import './partnerLogosStyles.css';
import './partnerLogosDecorations.css';

interface PartnerLogosProps {
  currentLanguage: 'en' | 'zh';
}

/**
 * 合作伙伴Logo墙组件
 *
 * 该组件在首页上展示合作伙伴的Logo，位于学生支持与安全和学生故事部分之间。
 * 支持从Strapi后端获取Logo数据，并根据当前语言显示相应的标题和描述。
 *
 * @component
 * @example
 * ```tsx
 * import { PartnerLogos } from '@/components/frontend/home/PartnerLogos';
 *
 * // 在首页中使用
 * function HomePage() {
 *   const { currentLanguage } = useLanguage();
 *   return (
 *     <div>
 *       <GraduationFeature />
 *       <PartnerLogos currentLanguage={currentLanguage} />
 *       <StudentStories />
 *     </div>
 *   );
 * }
 * ```
 *
 * @param {PartnerLogosProps} props - 组件属性
 * @returns {JSX.Element} 渲染的合作伙伴Logo墙
 */
const PartnerLogos: React.FC<PartnerLogosProps> = ({ currentLanguage }) => {
  // 使用自定义hook获取合作伙伴Logo数据
  const { logos, isLoading, error } = usePartnerLogos(currentLanguage);

  // 如果正在加载，显示加载指示器
  if (isLoading) {
    return (
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  // 如果加载出错，显示错误信息
  if (error) {
    console.error('Failed to load partner logos:', error);
  }

  // 调试信息
  console.log('PartnerLogos组件收到的logos数据:', logos);

  // 如果没有Logo数据，使用默认数据
  const partnerLogos = logos?.length ? logos : [];

  // 标题和副标题文本
  const title = currentLanguage === 'en'
    ? 'Trusted Partners'
    : '值得信赖的合作伙伴';

  const subtitle = currentLanguage === 'en'
    ? 'We have established long-term partnerships with leading educational institutions worldwide.'
    : '我们与世界各地领先教育机构、学校和组织建立了长期合作关系。';

  return (
    <div className="partner-logos-container">
      {/* 装饰性元素 */}
      <div className="partner-logos-decoration partner-logos-decoration-1"></div>
      <div className="partner-logos-decoration partner-logos-decoration-2"></div>
      <div className="partner-logos-decoration partner-logos-decoration-3"></div>
      <div className="partner-logos-decoration partner-logos-decoration-4"></div>

      <div className="container mx-auto">
        <div className="partner-logos-title">
          {title}
        </div>
        <div className="partner-logos-subtitle">
          {subtitle}
        </div>

        <div className="partner-logos-grid">
          {/* 只显示实际存在的Logo */}
          {partnerLogos.map((logo, index) => (
            <div
              key={logo.id || index}
              className="partner-logo-item"
              style={{ animationDelay: `${0.1 * (index % 6 + 1)}s` }} /* 每行重置动画延迟 */
            >
              <img
                src={logo.image_url}
                alt={logo.name || `Partner ${index + 1}`}
                className="partner-logo-image"
                style={{ maxHeight: '120px' }} /* 确保所有Logo高度一致 */
              />
            </div>
          ))}
          {/* 测试数据 - 在实际集成时删除 */}
          {/* 暂时禁用测试数据，以便于调试实际API数据 */}
          {false && partnerLogos.length === 0 && (
            <>
              <div className="partner-logo-item" style={{ animationDelay: '0.1s' }}>
                <img src="/Edgoing/partners/partner1.png" alt="Partner 1" className="partner-logo-image" style={{ maxHeight: '120px' }} />
              </div>
              <div className="partner-logo-item" style={{ animationDelay: '0.2s' }}>
                <img src="/Edgoing/partners/partner2.png" alt="Partner 2" className="partner-logo-image" style={{ maxHeight: '120px' }} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerLogos;
