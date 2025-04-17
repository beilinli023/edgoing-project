import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface LogoProps {
  className?: string;
  logoType?: 'navbar' | 'footer';
}

export const Logo: React.FC<LogoProps> = ({ 
  className,
  logoType = 'navbar'
}) => {
  const { currentLanguage } = useLanguage();
  
  // 统一使用logo_1.png
  const logoSrc = '/Edgoing/icon/logo_1.png';
  
  // 根据位置设置默认尺寸
  const defaultClass = logoType === 'navbar' 
    ? "h-10 w-auto" // 导航栏Logo尺寸略小
    : "h-16 w-auto"; // 页脚Logo尺寸调整为适中
  
  const cssClass = className || defaultClass;
  
  return (
    <div className="flex items-center justify-center">
      <img 
        src={logoSrc} 
        alt="edGoing Logo" 
        className={`object-contain ${cssClass} bg-transparent border-0`}
      />
    </div>
  );
};

export default Logo;
