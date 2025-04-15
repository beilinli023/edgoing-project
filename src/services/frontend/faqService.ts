import api from '../api';
import { FaqItemWithCategory } from '@/types/learnHowTypes';

// 获取所有FAQ
export const getAllFaqs = async (language = 'en'): Promise<FaqItemWithCategory[]> => {
  try {
    console.log(`API call: Fetching all FAQs (${language})`);
    // 修复：移除前导斜杠，因为 api 的 baseURL 已经设置为 '/api'
    console.log(`%c✅ 请求FAQ数据，路径: faqs?locale=${language}`, 'color: green; font-weight: bold');
    const response = await api.get(`faqs?locale=${language}`);

    // 验证返回的数据是否为数组
    if (!response || !response.data || !Array.isArray(response.data)) {
      console.warn('Invalid FAQs response format');
      return [];
    }

    console.log(`API success: Got ${response.data.length} FAQs`);
    return response.data;
  } catch (error) {
    console.error('获取FAQ失败:', error);
    return [];
  }
};

// 搜索FAQ
export const searchFaqs = async (query: string, language = 'en'): Promise<FaqItemWithCategory[]> => {
  if (!query.trim()) {
    return getAllFaqs(language);
  }

  try {
    console.log(`API call: Searching FAQs with query "${query}" (${language})`);
    // 修复：移除前导斜杠，因为 api 的 baseURL 已经设置为 '/api'
    console.log(`%c✅ 搜索FAQ数据，路径: faqs/search?q=${encodeURIComponent(query)}&locale=${language}`, 'color: green; font-weight: bold');
    const response = await api.get(`faqs/search?q=${encodeURIComponent(query)}&locale=${language}`);

    // 验证返回的数据是否为数组
    if (!response || !response.data || !Array.isArray(response.data)) {
      console.warn('Invalid search response format');
      return [];
    }

    console.log(`API success: Found ${response.data.length} FAQ results`);
    return response.data;
  } catch (error) {
    console.error('搜索FAQ失败:', error);
    return [];
  }
};

// 获取单个FAQ
export const getFaqById = async (id: number, language = 'en'): Promise<FaqItemWithCategory | null> => {
  try {
    console.log(`API call: Fetching FAQ by ID ${id} (${language})`);
    // 修复：移除前导斜杠，因为 api 的 baseURL 已经设置为 '/api'
    console.log(`%c✅ 请求单个FAQ数据，路径: faqs/${id}?locale=${language}`, 'color: green; font-weight: bold');
    const response = await api.get(`faqs/${id}?locale=${language}`);

    if (!response || !response.data) {
      console.warn(`FAQ with ID ${id} not found`);
      return null;
    }

    console.log(`API success: Got FAQ with ID ${id}`);
    return response.data;
  } catch (error) {
    console.error(`获取FAQ ID ${id}失败:`, error);
    return null;
  }
};
