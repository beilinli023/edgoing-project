import { getUniversityById, getAllUniversities, getUniversityIndex } from './universityService';
import { StudyAbroadPageContent, PartnerUniversity, StudyAbroadBenefit, StudyAbroadHero } from '@/types/studyAbroadTypes';
import apiClient from '../api/apiClient';

/**
 * 留学服务模块
 *
 * 该模块提供留学相关的数据服务，包括获取合作大学信息、留学优势等内容。
 * 支持多语言，可根据语言参数返回对应语言的内容。
 *
 * @module studyAbroadService
 */

/**
 * 获取留学页面内容，包括标题、描述、合作大学和留学优势等数据
 *
 * 该函数整合了留学页面所需的所有数据，包括从API获取的大学信息
 * 以及预定义的留学优势数据。函数会处理可能的数据缺失情况，确保返回有效数据。
 *
 * @param {('en'|'zh')} language - 语言选项，支持英文(en)或中文(zh)
 * @returns {Promise<StudyAbroadPageContent>} 包含所有留学页面内容的对象
 * @throws {Error} 当数据获取失败时抛出错误
 * @example
 * ```typescript
 * // 获取中文版留学页面内容
 * const contentZh = await getStudyAbroadContent('zh');
 *
 * // 获取英文版留学页面内容
 * const contentEn = await getStudyAbroadContent('en');
 * ```
 */
export const getStudyAbroadContent = async (language: 'en' | 'zh'): Promise<StudyAbroadPageContent> => {
  try {
    console.log(`Fetching study abroad content for language: ${language}`);

    // 尝试从API获取完整的留学页面内容
    try {
      const response = await fetch(`/api/universities/study-abroad/content?locale=${language}`);

      if (response.ok) {
        const data = await response.json();
        console.log('Successfully fetched study abroad content from API');
        return data as StudyAbroadPageContent;
      } else {
        console.log('Failed to fetch study abroad content from API, falling back to local data');
      }
    } catch (error) {
      console.error('Error fetching study abroad content from API:', error);
      console.log('Falling back to local data');
    }

    // 如果API获取失败，则使用本地数据
    // 获取大学数据，传递语言参数
    const universities = await getAllUniversities(language);

    // 防止universities为空数组或undefined
    if (!universities || universities.length === 0) {
      console.log(`No universities data available for language ${language}, using empty array`);
    }

    // 留学目的与种类数据
    const benefits: StudyAbroadBenefit[] = [
      {
        icon: 'graduation-cap',
        title_en: 'Academic Excellence',
        title_zh: '学术卓越',
        description_en: 'Access to world-class educational institutions and programs that enhance your academic credentials.',
        description_zh: '获取世界一流教育机构和课程，提升您的学术证书。'
      },
      {
        icon: 'globe',
        title_en: 'Global Perspective',
        title_zh: '全球视野',
        description_en: 'Develop a broader worldview and cross-cultural communication skills essential in today\'s global environment.',
        description_zh: '培养更广阔的世界观和跨文化交流能力，这在当今的全球环境中至关重要。'
      },
      {
        icon: 'briefcase',
        title_en: 'Career Advancement',
        title_zh: '职业发展',
        description_en: 'Gain a competitive edge in the job market with international experience and specialized knowledge.',
        description_zh: '通过国际经验和专业知识，在就业市场中获得竞争优势。'
      },
      {
        icon: 'users',
        title_en: 'Cultural Immersion',
        title_zh: '文化深浸',
        description_en: 'Experience different cultures firsthand, building lifelong international friendships and networks.',
        description_zh: '亲身体验不同文化，建立终身的国际友谊和人脉网络。'
      }
    ];

    // 构建留学页面完整内容
    const pageContent: StudyAbroadPageContent = {
      title_en: 'Study Abroad: Expand Your Horizons',
      title_zh: '留学：拓展你的视野',
      description_en: 'Embark on a life-changing study abroad journey to explore new cultures, gain a global perspective, and enhance your education. Whether you seek academic excellence, language immersion, or unforgettable experiences, studying abroad opens doors to endless opportunities.',
      description_zh: '踏上改变人生的留学之旅，探索新文化，获得全球视野，并提升你的教育水平。无论你追求学术卓越、语言深浸还是难忘的经历，留学都将为你打开无限机遇的大门。',
      benefits: benefits,
      universities: universities,
      cta_title_en: 'Ready to Start Your Journey?',
      cta_title_zh: '准备好开始您的旅程了吗？',
      cta_description_en: 'Contact our advisors to learn more about our study abroad programs and find the perfect fit for your educational goals.',
      cta_description_zh: '联系我们的顾问，了解我们的留学项目，并找到最适合您教育目标的项目。',
      cta_button_text_en: 'Get Started',
      cta_button_text_zh: '开始咨询',
      cta_button_link: '/contact'
    };

    return pageContent;
  } catch (error) {
    console.error('Error fetching study abroad content:', error);
    throw error;
  }
};

/**
 * 获取留学页面Hero数据
 *
 * @param {('en'|'zh')} language - 语言选项，支持英文(en)或中文(zh)
 * @returns {Promise<StudyAbroadHero>} 留学页面Hero数据
 */
export const getStudyAbroadHero = async (language: 'en' | 'zh'): Promise<StudyAbroadHero> => {
  try {
    console.log(`获取留学页面Hero数据，语言: ${language}`);

    // 从 API 获取数据
    const response = await apiClient.get(`study-abroad/hero?locale=${language}`);

    // 检查响应是否成功
    if (response && response.success && response.data) {
      console.log('成功获取留学页面Hero数据');
      return response.data;
    }

    // 如果没有数据，返回默认值
    console.log('未找到留学页面Hero数据，使用默认值');
    return {
      id: 0,
      title: language === 'en' ? 'Study Abroad: Expand Your Horizons' : '留学：拓展你的视野',
      subtitle: language === 'en' ? 'Embark on a life-changing journey' : '踏上改变人生的旅程',
      imageUrl: '/Edgoing/StudyAbroad.jpg'
    };
  } catch (error) {
    console.error('获取留学页面Hero数据出错:', error);
    // 出错时返回默认值
    return {
      id: 0,
      title: language === 'en' ? 'Study Abroad: Expand Your Horizons' : '留学：拓展你的视野',
      subtitle: language === 'en' ? 'Embark on a life-changing journey' : '踏上改变人生的旅程',
      imageUrl: '/Edgoing/StudyAbroad.jpg'
    };
  }
};

/**
 * 留学服务模块
 * 整合各个子模块的功能
 */
export {
  getUniversityById,
  getAllUniversities,
  getUniversityIndex
};

// 导出默认对象，兼容之前的导入方式
export default {
  getStudyAbroadContent,
  getStudyAbroadHero,
  getUniversityById,
  getAllUniversities,
  getUniversityIndex
};
