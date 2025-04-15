import axios from 'axios';
import { Program, ProgramFilterParams, ProgramsResponse } from '@/types/programTypes';

/**
 * 从 Strapi 获取项目列表
 */
export const fetchStrapiPrograms = async (
  filters: ProgramFilterParams = {},
  currentLanguage: 'en' | 'zh' = 'en'
): Promise<ProgramsResponse> => {
  try {
    const { category, country, gradeLevel, programType, page = 1, limit = 6, search } = filters;

    const params: any = {
      locale: currentLanguage,
      page,
      limit
    };

    // 优先使用 programType 参数，如果没有再使用 category
    if (programType) params.programType = programType;
    else if (category) params.programType = category;

    if (country) params.country = country;
    if (gradeLevel) params.gradeLevel = gradeLevel;
    if (search) params.search = search;

    // 添加调试日志，显示完整的筛选参数
    console.log('原始筛选参数:', filters);
    console.log('处理后的请求参数:', params);

    // 修复：使用正确的API路径
    console.log('%c✅ 请求项目数据，路径: /api/programs', 'color: green; font-weight: bold');

    try {
      const response = await axios.get('/api/programs', { params });
      console.log('服务器响应状态:', response.status);
      console.log('服务器响应数据条数:', response.data?.data?.length || 0);
      return response.data;
    } catch (requestError) {
      console.error('请求错误:', requestError);
      if (requestError.response) {
        console.error('响应状态:', requestError.response.status);
        console.error('响应数据:', requestError.response.data);
      }
      throw requestError;
    }
  } catch (error) {
    console.error('Error fetching programs from Strapi:', error);
    // 抛出错误，不使用静态数据
    throw error;
  }
};

/**
 * 从 Strapi 获取单个项目详情
 */
export const fetchStrapiProgramById = async (
  id: string,
  currentLanguage: 'en' | 'zh' = 'en'
): Promise<Program | null> => {
  try {
    console.log(`Fetching program ${id} from Strapi with locale ${currentLanguage}`);

    // 直接使用原始 ID
    const actualId = id;
    console.log(`Using original ID: ${actualId} with locale ${currentLanguage}`);

    // 添加调试信息
    console.log(`Making request to /api/programs/${actualId} with locale ${currentLanguage}`);

    const response = await axios.get(`/api/programs/${actualId}`, {
      params: { locale: currentLanguage }
    });

    // 打印响应数据以便调试
    console.log(`Response status: ${response.status}`);
    console.log(`Response data available: ${!!response.data}`);
    if (response.data) {
      console.log(`Program title: ${response.data.title_zh || response.data.title_en || 'N/A'}`);
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching program ${id} from Strapi:`, error);
    return null;
  }
};

/**
 * 从 Strapi 获取项目筛选选项
 */
export const fetchStrapiProgramFilters = async (
  currentLanguage: 'en' | 'zh' = 'en'
): Promise<{
  categories: string[];
  gradeLevels: string[];
  countries: string[];
}> => {
  try {
    console.log(`Fetching program filters from Strapi with locale ${currentLanguage}`);
    // 修复：使用正确的API路径
    console.log('%c✅ 请求项目筛选数据，路径: /api/programs/filters', 'color: green; font-weight: bold');
    const response = await axios.get('/api/programs/filters', {
      params: { locale: currentLanguage }
    });

    const { programTypes, grades, countries } = response.data;

    return {
      categories: programTypes.map((type: any) => type.name),
      gradeLevels: grades.map((grade: any) => grade.name),
      countries: countries.map((country: any) => country.name)
    };
  } catch (error) {
    console.error('Error fetching program filters from Strapi:', error);
    // 抛出错误，不使用静态数据
    throw error;
  }
};
