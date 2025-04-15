import { Program, ProgramFilterParams, ProgramsResponse } from '@/types/programTypes';
import { debugLog, errorLog, traceDataLoading } from '@/utils/debugHelper';

/**
 * 添加缓存打破参数到URL，确保获取最新数据
 */
export const addCacheBuster = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${new Date().getTime()}`;
};

/**
 * 将值转换为字符串数组
 */
const toStringArray = (value: string | string[] | undefined): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map(item => typeof item === 'string' ? item : String(item))
      .filter(Boolean);
  }
  return [value];
};

/**
 * 统一错误处理包装器
 */
const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  errorMessage: string,
  fallback?: T
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    errorLog('programFileService', errorMessage, error);
    if (fallback !== undefined) {
      return fallback;
    }
    throw error;
  }
};

interface RawProgramData {
  id: string | number;
  title_en: string;
  title_zh: string;
  program_id: string;
  image: string;
  location_en: string;
  location_zh: string;
  duration: string;
  duration_en?: string;
  duration_zh?: string;
  country?: string;
  country_en?: string | string[];
  country_zh?: string | string[];
  program_type_en?: string | string[];
  program_type_zh?: string | string[];
  destination_en?: string;
  destination_zh?: string;
  grade_level_en?: string | string[];
  grade_level_zh?: string | string[];
  grade_levels?: string[];
  gallery_images?: string[];
  gallery?: string[];
  overview_en?: string;
  overview_zh?: string;
  description_en?: string;
  description_zh?: string;
  highlights_en?: string;
  highlights_zh?: string;
  itinerary_en?: string;
  itinerary_zh?: string;
  features_en?: string;
  features_zh?: string;
  other_info_en?: string;
  other_info_zh?: string;
  status?: string;
  published_at?: string;
  // 添加营期和截止日期字段
  camp_period?: string;
  camp_period_en?: string;
  camp_period_zh?: string;
  deadline?: string;
}

/**
 * 适配程序数据，确保与数据结构兼容
 */
const adaptProgramData = (program: RawProgramData): Program => {
  // 处理年级水平
  const gradeLevels = program.grade_levels && Array.isArray(program.grade_levels) && program.grade_levels.length > 0
    ? program.grade_levels
    : [
        ...toStringArray(program.grade_level_en),
        ...toStringArray(program.grade_level_zh)
      ].filter(level => level && level.trim() !== '');

  const adaptedProgram: Program = {
    id: String(program.id),
    title_en: program.title_en || '',
    title_zh: program.title_zh || '',
    program_id: program.program_id || '',
    image: program.image || '',
    location_en: program.location_en || '',
    location_zh: program.location_zh || '',
    duration: program.duration || '',
    duration_en: program.duration_en || '',
    duration_zh: program.duration_zh || '',
    country: program.country || '',
    country_en: toStringArray(program.country_en),
    country_zh: toStringArray(program.country_zh),
    grade_levels: gradeLevels,
    program_type_en: toStringArray(program.program_type_en),
    program_type_zh: toStringArray(program.program_type_zh),
    destination_en: program.destination_en || '',
    destination_zh: program.destination_zh || '',
    grade_level_en: toStringArray(program.grade_level_en),
    grade_level_zh: toStringArray(program.grade_level_zh),
    // 添加营期和截止日期字段
    camp_period: program.camp_period || '',
    camp_period_en: program.camp_period_en || '',
    camp_period_zh: program.camp_period_zh || '',
    deadline: program.deadline || '',
    overview_en: program.overview_en || '',
    overview_zh: program.overview_zh || '',
    description_en: program.description_en || '',
    description_zh: program.description_zh || '',
    highlights_en: program.highlights_en || '',
    highlights_zh: program.highlights_zh || '',
    itinerary_en: program.itinerary_en || '',
    itinerary_zh: program.itinerary_zh || '',
    features_en: program.features_en || '',
    features_zh: program.features_zh || '',
    other_info_en: program.other_info_en || '',
    other_info_zh: program.other_info_zh || '',
    gallery_images: program.gallery_images || program.gallery || []
  };

  return adaptedProgram;
};

/**
 * 从本地 JSON 文件加载项目数据
 */
const loadProgramFromFile = async (filename: string): Promise<Program | null> => {
  return withErrorHandling(async () => {
    // 格式化文件名
    if (!filename.startsWith('program') && !isNaN(Number(filename))) {
      filename = `program${filename}.json`;
    } else if (!filename.endsWith('.json')) {
      filename = `${filename}.json`;
    }

    const url = addCacheBuster(`/content/programs/${filename}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      debugLog('programFileService', `加载项目数据失败 (${filename}): ${response.status}`);
      return null;
    }

    const responseText = await response.text();
    let data;

    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      debugLog('programFileService', `解析项目JSON数据失败 (${filename})`);
      return null;
    }

    if (!data || !data.id) {
      debugLog('programFileService', `项目数据格式错误 (${filename})`);
      return null;
    }

    return adaptProgramData(data);
  }, `加载项目数据出错 (${filename})`, null);
};

/**
 * 从JSON文件加载所有Program列表
 */
export const loadProgramsFromFiles = async (): Promise<Program[]> => {
  return withErrorHandling(async () => {
    debugLog('programFileService', '开始加载项目索引文件');
    const indexResponse = await fetch(addCacheBuster('/content/programs/index.json'));

    if (!indexResponse.ok) {
      throw new Error(`无法加载Program索引文件: ${indexResponse.statusText}`);
    }

    const filenames = await indexResponse.json();

    const programPromises = filenames.map(async (filename: string) => {
      try {
        const response = await fetch(addCacheBuster(`/content/programs/${filename}`));
        if (!response.ok) return null;

        const programData = await response.json();

        if (!programData || !programData.id || !programData.title_zh) {
          return null;
        }

        // 如果项目有状态字段，且不是"published"，则跳过该项目
        if (programData.status && programData.status !== 'published') {
          return null;
        }

        return adaptProgramData(programData);
      } catch (error) {
        return null;
      }
    });

    const programs = await Promise.all(programPromises);
    const validPrograms = programs.filter((program): program is Program => program !== null);

    // 去重
    const uniquePrograms = Array.from(
      validPrograms.reduce((map, program) => {
        if (!map.has(program.id)) {
          map.set(program.id, program);
        }
        return map;
      }, new Map<string, Program>()).values()
    );

    debugLog('programFileService', `加载了 ${uniquePrograms.length} 个唯一项目`);

    return uniquePrograms;
  }, '加载Programs时出错', []);
};

/**
 * 根据ID获取单个Program详情
 */
export const loadProgramById = async (id: string): Promise<Program | null> => {
  return withErrorHandling(async () => {
    // 尝试直接通过文件名获取特定项目
    const programFromFile = await loadProgramFromFile(`program${id}.json`);
    if (programFromFile) {
      return programFromFile;
    }

    // 回退到加载所有项目并过滤
    const programs = await loadProgramsFromFiles();

    // 先尝试完全匹配ID
    const programById = programs.find(p => String(p.id) === String(id));
    if (programById) {
      return programById;
    }

    // 再尝试使用program_id匹配
    return programs.find(p => p.program_id === id) || null;
  }, `加载ID为 ${id} 的项目时出错`, null);
};

/**
 * 根据筛选参数加载和过滤Program列表
 */
export const loadFilteredPrograms = async (
  filters: ProgramFilterParams = {}
): Promise<ProgramsResponse> => {
  return withErrorHandling(async () => {
    let programs = await loadProgramsFromFiles();

    // 按ID筛选
    if (filters.ids?.length) {
      programs = programs.filter(program => filters.ids!.includes(program.id));
    }

    // 按类别筛选
    if (filters.category) {
      const categoryLower = filters.category.toLowerCase();
      programs = programs.filter(program => {
        return program.program_type_en.some(type => type.toLowerCase().includes(categoryLower)) ||
               program.program_type_zh.some(type => type.toLowerCase().includes(categoryLower));
      });
    }

    // 按国家筛选
    if (filters.country) {
      const countryLower = filters.country.toLowerCase();
      programs = programs.filter(program => {
        const fields = [
          program.country,
          program.destination_en,
          program.location_en,
          ...program.country_en,
          ...program.country_zh
        ];

        return fields.some(field =>
          field && field.toLowerCase().includes(countryLower)
        );
      });
    }

    // 按年级筛选
    if (filters.gradeLevel) {
      const gradeLevelLower = filters.gradeLevel.toLowerCase();
      programs = programs.filter(program =>
        program.grade_levels?.some(level =>
          level?.toLowerCase().includes(gradeLevelLower)
        )
      );
    }

    // 按关键词搜索
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      programs = programs.filter(program => {
        const searchFields = [
          program.title_en,
          program.title_zh,
          program.location_en,
          program.location_zh
        ];

        return searchFields.some(field =>
          field?.toLowerCase().includes(searchLower)
        );
      });
    }

    // 分页
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      data: programs.slice(startIndex, endIndex),
      total: programs.length,
      page,
      totalPages: Math.ceil(programs.length / limit)
    };
  }, '加载和过滤Programs时出错', { data: [], total: 0, page: 1, totalPages: 0 });
};

/**
 * 加载Program筛选选项
 */
export const loadProgramFilters = async () => {
  return withErrorHandling(async () => {
    const programs = await loadProgramsFromFiles();

    const categories = new Set<string>();
    const countries = new Set<string>();
    const gradeLevels = new Set<string>();

    programs.forEach(program => {
      // 收集项目类型
      program.program_type_en.forEach(type => categories.add(type));
      program.program_type_zh.forEach(type => categories.add(type));

      // 收集国家/地区
      if (program.country) countries.add(program.country);
      if (program.destination_en) countries.add(program.destination_en);
      program.country_en.forEach(c => countries.add(c));
      program.country_zh.forEach(c => countries.add(c));

      // 收集年级水平
      program.grade_levels?.forEach(level => {
        if (level) gradeLevels.add(level);
      });
    });

    return {
      categories: Array.from(categories),
      countries: Array.from(countries),
      gradeLevels: Array.from(gradeLevels)
    };
  }, '加载Program筛选选项时出错', { categories: [], countries: [], gradeLevels: [] });
};

/**
 * 获取单个项目数据（先尝试API，失败则从本地文件加载）
 */
export const getProgram = async (id: string): Promise<Program | null> => {
  return withErrorHandling(async () => {
    try {
      const response = await fetch(`/api/programs/${id}`);
      if (response.ok) {
        const data = await response.json();
        return adaptProgramData(data);
      }
    } catch {
      // API 失败，继续尝试本地文件
    }

    return loadProgramFromFile(id);
  }, `获取项目 ${id} 数据出错`, null);
};

/**
 * 获取所有项目数据（先尝试API，失败则从本地文件加载）
 */
export const getAllPrograms = async (): Promise<Program[]> => {
  return withErrorHandling(async () => {
    try {
      const response = await fetch('/api/programs');
      if (response.ok) {
        const data = await response.json();
        return data.map(adaptProgramData);
      }
    } catch {
      // API 失败，继续尝试本地文件
    }

    return loadProgramsFromFiles();
  }, '获取所有项目数据出错', []);
};
