import apiClient from './api/apiClient';
import { ProgramFilterParams, ProgramsResponse } from '@/types/programTypes';
import { mockPrograms } from './mockData/programs/mockPrograms';
import { extractData } from './api/responseHelpers';

export const getPrograms = async (filters: ProgramFilterParams): Promise<ProgramsResponse> => {
  try {
    // 修复：移除重复的 /api 前缀
    console.log('%c✅ 请求项目数据，路径: programs', 'color: green; font-weight: bold');
    const response = await apiClient.get('programs', { params: filters });
    const programsData = extractData<ProgramsResponse>(response);

    // Return properly cast response
    return programsData;
  } catch (error) {
    console.error('Error fetching programs:', error);

    // Return mock data for development
    return {
      data: mockPrograms,
      total: mockPrograms.length,
      page: 1,
      totalPages: 1
    };
  }
};
