import { useQuery } from '@tanstack/react-query';
import { fetchFrontendPrograms, fetchProgramById, fetchProgramFilters } from '../services/frontendProgramService';
import { ProgramFilterParams } from '../types/programTypes';
import { useLanguage } from '@/context/LanguageContext';

/**
 * 获取课程列表的自定义Hook
 * @param {ProgramFilterParams} filters - 筛选参数
 * @returns {Object} 包含课程列表数据、加载状态和错误信息的对象
 */
export function usePrograms(filters: ProgramFilterParams = {}) {
  const { currentLanguage } = useLanguage();

  return useQuery({
    queryKey: ['programs', filters, currentLanguage],
    queryFn: () => fetchFrontendPrograms(filters, currentLanguage as 'en' | 'zh'),
  });
}

/**
 * 获取特色课程的自定义Hook
 * @returns {Object} 包含特色课程数据、加载状态和错误信息的对象
 */
export function useFeaturedPrograms() {
  const { currentLanguage } = useLanguage();

  return useQuery({
    queryKey: ['featuredPrograms', currentLanguage],
    queryFn: () => fetchFrontendPrograms({ ids: ['3', '6', '7'] }, currentLanguage as 'en' | 'zh'),
  });
}

/**
 * 获取单个课程详情的自定义Hook
 * @param {string} id - 课程ID
 * @returns {Object} 包含课程详情数据、加载状态和错误信息的对象
 */
export function useProgram(id: string) {
  const { currentLanguage } = useLanguage();

  return useQuery({
    queryKey: ['program', id, currentLanguage],
    queryFn: () => fetchProgramById(id, currentLanguage as 'en' | 'zh'),
    enabled: !!id, // 只有当ID存在时才执行查询
  });
}

/**
 * 获取课程筛选选项的自定义Hook
 * @returns {Object} 包含课程筛选选项数据、加载状态和错误信息的对象
 */
export function useProgramFilters() {
  const { currentLanguage } = useLanguage();

  return useQuery({
    queryKey: ['programFilters', currentLanguage],
    queryFn: () => fetchProgramFilters(currentLanguage as 'en' | 'zh'),
  });
}
