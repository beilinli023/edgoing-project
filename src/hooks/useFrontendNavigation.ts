
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getNavigationMenu } from "@/services/frontendContentService";

interface MenuItem {
  name: string;
  path: string;
}

export const useFrontendNavigation = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        const items = await getNavigationMenu(currentLanguage);

        if (items && items.length > 0) {
          setMenuItems(items);
        } else {
          setMenuItems(getDefaultMenuItems());
        }
      } catch (error) {
        console.error('Failed to fetch navigation menu:', error);
        setMenuItems(getDefaultMenuItems());
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, [currentLanguage]);

  // 统一的默认菜单，移除了博客链接，确保与FrontendNavbar中一致
  const getDefaultMenuItems = (): MenuItem[] => {
    return [
      { name: currentLanguage === 'zh' ? '首页' : 'Home', path: '/' },
      { name: currentLanguage === 'zh' ? '游学项目' : 'Educational Travel Programs', path: '/programs' },
      { name: currentLanguage === 'zh' ? '精彩留学' : 'Study Abroad', path: '/study-abroad' },
      { name: currentLanguage === 'zh' ? '关于我们' : 'About Us', path: '/about' },
      { name: currentLanguage === 'zh' ? '了解更多' : 'Learn More', path: '/learn-more' },
      { name: currentLanguage === 'zh' ? '开始计划' : 'Start Planning', path: '/start-planning' },
    ];
  };

  return {
    menuItems,
    isLoading
  };
};
