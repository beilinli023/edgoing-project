import { useQuery } from '@tanstack/react-query';
import { 
  getStudyAbroadContent, 
  getUniversityById, 
  getAllUniversities, 
  getUniversityIndex 
} from '../services/frontend/studyAbroadService';

/**
 * 获取留学页面内容的自定义Hook
 * @param {('en'|'zh')} language - 语言选项，支持英文(en)或中文(zh)
 * @returns {Object} 包含留学页面内容数据、加载状态和错误信息的对象
 */
export function useStudyAbroadContent(language: 'en' | 'zh' = 'en') {
  return useQuery({
    queryKey: ['studyAbroadContent', language],
    queryFn: () => getStudyAbroadContent(language),
  });
}

/**
 * 获取大学详情的自定义Hook
 * @param {number} id - 大学ID
 * @param {('en'|'zh')} language - 语言选项，支持英文(en)或中文(zh)
 * @returns {Object} 包含大学详情数据、加载状态和错误信息的对象
 */
export function useUniversity(id: number, language: 'en' | 'zh' = 'en') {
  return useQuery({
    queryKey: ['university', id, language],
    queryFn: () => getUniversityById(id, language),
    enabled: !!id, // 只有当ID存在时才执行查询
  });
}

/**
 * 获取所有合作大学的自定义Hook
 * @returns {Object} 包含所有合作大学数据、加载状态和错误信息的对象
 */
export function useAllUniversities() {
  return useQuery({
    queryKey: ['allUniversities'],
    queryFn: getAllUniversities,
  });
}

/**
 * 获取大学索引的自定义Hook
 * @returns {Object} 包含大学索引数据、加载状态和错误信息的对象
 */
export function useUniversityIndex() {
  return useQuery({
    queryKey: ['universityIndex'],
    queryFn: getUniversityIndex,
  });
}
