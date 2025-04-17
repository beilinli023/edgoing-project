
import apiClient from '../api/apiClient';
import { extractData } from '../api/responseHelpers';
import { StudyAbroadPageContent } from '@/types/studyAbroadTypes';
import { getDefaultStudyAbroadContent } from './mockData/universityMockData';

/**
 * 获取留学页面内容
 */
export const getStudyAbroadContent = async (language = 'en'): Promise<StudyAbroadPageContent> => {
  try {
    console.log(`Fetching study abroad content for language: ${language}`);
    const response = await apiClient.get('/study-abroad/content', { 
      params: { language } 
    });
    
    const data = extractData<StudyAbroadPageContent>(response);
    
    if (data && 
        typeof data === 'object' && 
        'title_en' in data && 
        'benefits' in data && 
        'universities' in data) {
      console.log('Successfully fetched study abroad content from API');
      return data;
    } else {
      console.error('Invalid study abroad data format returned from API', data);
      return getDefaultStudyAbroadContent();
    }
  } catch (error) {
    console.error('Error fetching study abroad content:', error);
    return getDefaultStudyAbroadContent();
  }
};

export default {
  getStudyAbroadContent
};
