import apiClient, { extractData } from '../api/apiClient';

// 导航数据结构接口定义
interface NavigationItem {
  title_en: string;
  title_zh: string;
  url: string;
}

// 导航菜单显示项接口
interface MenuItem {
  name: string;
  path: string;
}

// 获取导航菜单
export const getNavigationMenu = async (language = 'en'): Promise<MenuItem[]> => {
  try {
    // 由于可能遇到网络或API问题，这里设置超时
    // 修复：移除重复的 /api 前缀
    console.log('%c✅ 请求导航菜单数据，路径: navigation', 'color: green; font-weight: bold');
    const response = await apiClient.get('navigation').catch(error => {
      console.error('Navigation API request failed:', error);
      return null;
    });

    // 1. 首先判断响应是否存在
    if (!response) {
      console.warn('No response received from navigation API, using default menu');
      return getDefaultNavigationItems(language);
    }

    // 2. 尝试提取数据，使用更安全的方式
    let responseData: NavigationItem[] | { data: NavigationItem[] } | unknown;
    try {
      responseData = extractData<unknown>(response);
    } catch (extractError) {
      console.error('Failed to extract navigation data:', extractError);
      return getDefaultNavigationItems(language);
    }

    // 3. 验证提取的数据
    // 如果responseData是数组，直接使用
    if (Array.isArray(responseData)) {
      console.log('Navigation array data retrieved successfully');
      return responseData.map((item) => ({
        name: language === 'en' ? (item.title_en || 'Missing Title') : (item.title_zh || '缺少标题'),
        path: item.url || '/'
      }));
    }

    // 如果responseData是对象且有data属性，并且data是数组
    if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray(responseData.data)) {
      console.log('Navigation object data retrieved successfully');
      return (responseData.data as NavigationItem[]).map((item) => ({
        name: language === 'en' ? (item.title_en || 'Missing Title') : (item.title_zh || '缺少标题'),
        path: item.url || '/'
      }));
    }

    // 如果所有尝试都失败，记录错误并返回默认值
    console.error('Invalid navigation data format:', responseData);
    return getDefaultNavigationItems(language);
  } catch (error) {
    console.error('Error in navigation service:', error);
    return getDefaultNavigationItems(language);
  }
};

// 默认导航项（保持中英文菜单项顺序一致）
const getDefaultNavigationItems = (language = 'en') => {
  return [
    { name: language === 'en' ? 'Home' : '首页', path: '/' },
    { name: language === 'en' ? 'Educational Travel Programs' : '游学项目', path: '/programs' },
    { name: language === 'en' ? 'Study Abroad' : '精彩留学', path: '/study-abroad' },
    { name: language === 'en' ? 'About Us' : '关于我们', path: '/about' },
    { name: language === 'en' ? 'Learn More' : '了解更多', path: '/learn-more' },
    { name: language === 'en' ? 'Start Planning' : '开始计划', path: '/start-planning' },
  ];
};

export default {
  getNavigationMenu
};
