
import { FiltersResponse } from '@/types/programTypes';

export const mockFilterOptions: FiltersResponse = {
  categories: [
    { id: 'academic', name_en: 'Academic Study', name_zh: '学术研究' },
    { id: 'cultural', name_en: 'Cultural Experience', name_zh: '文化体验' },
    { id: 'language', name_en: 'Language Immersion', name_zh: '语言沉浸' },
    { id: 'internship', name_en: 'Internship', name_zh: '实习' },
    { id: 'volunteer', name_en: 'Volunteer', name_zh: '志愿服务' }
  ],
  regions: [
    { id: 'northAmerica', name_en: 'North America', name_zh: '北美洲' },
    { id: 'europe', name_en: 'Europe', name_zh: '欧洲' },
    { id: 'asia', name_en: 'Asia', name_zh: '亚洲' },
    { id: 'oceania', name_en: 'Oceania', name_zh: '大洋洲' }
  ],
  countries: [
    { id: 'usa', name_en: 'USA', name_zh: '美国' },
    { id: 'uk', name_en: 'UK', name_zh: '英国' },
    { id: 'canada', name_en: 'Canada', name_zh: '加拿大' },
    { id: 'australia', name_en: 'Australia', name_zh: '澳大利亚' },
    { id: 'japan', name_en: 'Japan', name_zh: '日本' },
    { id: 'france', name_en: 'France', name_zh: '法国' },
    { id: 'germany', name_en: 'Germany', name_zh: '德国' }
  ],
  gradeLevels: [
    { id: 'elementary', name_en: 'Elementary School', name_zh: '小学' },
    { id: 'middle', name_en: 'Middle School', name_zh: '初中' },
    { id: 'high', name_en: 'High School', name_zh: '高中' },
    { id: 'university', name_en: 'University', name_zh: '大学' }
  ]
};
