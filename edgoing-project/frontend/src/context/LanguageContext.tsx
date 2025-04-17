
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 从URL中获取语言参数
  const getInitialLanguage = (): Language => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang');
      // 添加日志以查看实际的URL参数
      console.log('从URL获取的语言参数:', langParam);
      // 只允许'en'或'zh'作为有效值
      if (langParam === 'en' || langParam === 'zh') {
        return langParam;
      }
      // 如果参数包含'zh'前缀，但不完全匹配，也返回'zh'
      if (langParam && langParam.startsWith('zh')) {
        console.log('参数包含 zh 前缀，使用中文');
        return 'zh';
      }
    }
    return 'zh'; // 默认语言
  };

  const [currentLanguage, setCurrentLanguage] = useState<Language>(getInitialLanguage());

  // 监听URL变化
  useEffect(() => {
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang');
      console.log('URL变化，新的语言参数:', langParam);
      if (langParam === 'en' || langParam === 'zh') {
        setCurrentLanguage(langParam);
      } else if (langParam && langParam.startsWith('zh')) {
        // 如果参数包含'zh'前缀，但不完全匹配，也设置为'zh'
        console.log('参数包含 zh 前缀，使用中文');
        setCurrentLanguage('zh');
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const setLanguage = (lang: Language) => {
    // 确保语言参数值为'en'或'zh'
    const validLang: Language = lang === 'zh' ? 'zh' : 'en';
    console.log(`设置语言为: ${validLang}`);
    setCurrentLanguage(validLang);

    // 更新URL
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', validLang);

      // 删除可能存在的其他语言参数
      if (url.searchParams.has('locale')) {
        url.searchParams.delete('locale');
      }

      // 使用 window.location.href 而不是 pushState，这会触发页面重新加载
      window.location.href = url.toString();
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
