/**
 * 表单数据本地存储服务
 * 用于在没有真实后端API的情况下，将表单提交的数据保存到本地存储
 */

import { PlanningFormData } from '@/types/formTypes';

// 本地存储键名
const FORM_SUBMISSIONS_KEY = 'edgoing_form_submissions';

/**
 * 获取所有已保存的表单提交数据
 * @returns 所有表单提交的数组
 */
export function getLocalFormSubmissions(): Array<{
  data: PlanningFormData;
  id: string;
  timestamp: string;
}> {
  try {
    const storedData = localStorage.getItem(FORM_SUBMISSIONS_KEY);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error('读取本地表单数据失败:', error);
    return [];
  }
}

/**
 * 保存表单提交数据到本地存储
 * @param formData 用户提交的表单数据
 * @returns 保存结果，包含生成的唯一ID
 */
export function saveFormSubmissionLocally(formData: PlanningFormData): {
  success: boolean;
  id: string;
  timestamp: string;
  error?: string;
} {
  try {
    // 获取现有的提交记录
    const existingSubmissions = getLocalFormSubmissions();
    
    // 为新提交生成唯一ID和时间戳
    const newSubmission = {
      id: generateUniqueId(),
      timestamp: new Date().toISOString(),
      data: formData
    };
    
    // 添加新提交到列表开头（最新的在前面）
    existingSubmissions.unshift(newSubmission);
    
    // 如果超过100条记录，保留最新的100条
    const limitedSubmissions = existingSubmissions.slice(0, 100);
    
    // 保存到本地存储
    localStorage.setItem(FORM_SUBMISSIONS_KEY, JSON.stringify(limitedSubmissions));
    
    console.log('表单数据已保存到本地存储:', newSubmission);
    
    return {
      success: true,
      id: newSubmission.id,
      timestamp: newSubmission.timestamp
    };
  } catch (error) {
    console.error('保存表单数据到本地存储失败:', error);
    return {
      success: false,
      id: '',
      timestamp: '',
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}

/**
 * 清除所有本地存储的表单数据
 * @returns 是否成功清除
 */
export function clearLocalFormSubmissions(): boolean {
  try {
    localStorage.removeItem(FORM_SUBMISSIONS_KEY);
    return true;
  } catch (error) {
    console.error('清除本地表单数据失败:', error);
    return false;
  }
}

/**
 * 生成唯一ID
 * @returns 唯一ID字符串
 */
function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}
