import { PartnerUniversityDetail } from '@/types/studyAbroadTypes';

interface UniversityIndex {
  universities: {
    id: number;
    file: string;
    name_en: string;
    name_zh: string;
    featured: boolean;
  }[];
  meta: {
    total_count: number;
    last_updated: string;
    version: string;
  };
}

/**
 * 获取大学索引文件
 * 注意: 这个方法已经不再使用，保留仅为了兼容性
 */
export const getUniversityIndex = async (): Promise<UniversityIndex> => {
  try {
    console.log('Warning: getUniversityIndex is deprecated, using API instead');

    // 使用API获取大学列表
    const response = await fetch('/api/universities?locale=en');

    if (!response.ok) {
      throw new Error(`Failed to fetch university index: ${response.status}`);
    }

    const universities = await response.json();

    // 构建兼容的索引格式
    const indexData: UniversityIndex = {
      universities: universities.map(uni => ({
        id: uni.id,
        file: `university${uni.id}.json`,
        name_en: uni.name_en,
        name_zh: uni.name_zh,
        featured: true
      })),
      meta: {
        total_count: universities.length,
        last_updated: new Date().toISOString(),
        version: '2.0'
      }
    };

    return indexData;
  } catch (error) {
    console.error('Error fetching university index:', error);
    throw error;
  }
};

/**
 * 从API获取大学详情
 */
export const getUniversityById = async (id: number, language = 'en'): Promise<PartnerUniversityDetail> => {
  try {
    console.log(`Fetching university details for ID: ${id}, language: ${language}`);

    // 使用API获取大学详情
    const response = await fetch(`/api/universities/${id}?locale=${language}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch university data: ${response.status}`);
    }

    const data = await response.json();

    if (data && typeof data === 'object' && 'id' in data) {
      console.log('Successfully fetched university details from API');
      return data as PartnerUniversityDetail;
    } else {
      console.error('Invalid university data format from API', data);
      throw new Error('Invalid university data format');
    }
  } catch (error) {
    console.error(`Error fetching university details for ID ${id}:`, error);
    throw error;
  }
};

/**
 * 获取所有大学列表（用于StudyAbroadPage中的合作大学部分）
 * @param {string} language - 语言选项，默认为 'en'
 */
export const getAllUniversities = async (language: 'en' | 'zh' = 'en'): Promise<PartnerUniversityDetail[]> => {
  try {
    console.log(`Fetching all universities from API for language: ${language}`);

    // 使用API获取所有大学，传递语言参数
    const response = await fetch(`/api/universities?locale=${language}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch universities: ${response.status}`);
    }

    const universities = await response.json();
    console.log(`Successfully fetched ${universities.length} universities for language: ${language}`);
    return universities as PartnerUniversityDetail[];
  } catch (error) {
    console.error(`Error fetching all universities for language ${language}:`, error);
    return [];
  }
};

export default {
  getUniversityIndex,
  getUniversityById,
  getAllUniversities
};
