import { Program, ProgramFilterParams, ProgramsResponse } from '@/types/programTypes';
import { loadFilteredPrograms, loadProgramById, loadProgramFilters } from './programs/programFileService';
import { fetchStrapiPrograms, fetchStrapiProgramById, fetchStrapiProgramFilters } from './strapiProgramService';

// 静态程序数据用作回退机制（使用真实程序数据）
const FALLBACK_PROGRAMS = [
  {
    id: "1",
    title_en: "English Language Summer School 2025 Adcote Matrix International",
    title_zh: "2025年阿德科特国际英语暑期学校",
    program_id: "MYLAN-2025-002",
    image: "/Edgoing/Program_Page/Malaysia/Picture_3.jpg",
    location_en: "Malaysia",
    location_zh: "马来西亚",
    duration: "3 weeks",
    duration_en: "3 weeks",
    duration_zh: "3 周",
    country: "Malaysia",
    program_type_en: ["Language Intensive", "Language & Lifestyle"],
    program_type_zh: ["语言强化", "语言与生活"],
    destination_en: "Malaysia",
    destination_zh: "马来西亚",
    grade_level_en: ["Middle School"],
    grade_level_zh: ["初中"],
    grade_levels: ["Middle School", "初中"],
    overview_en: "Our 3-week English Language Summer School is designed for learners aged 10 to 14, offering a comprehensive and immersive experience to develop English language skills.",
    overview_zh: "我们的3周英语夏令营专为10至14岁的学习者设计，提供全面且沉浸式的体验，帮助学生提升英语语言能力。"
  },
  {
    id: "2",
    title_en: "Singapore 'Sea, Land, Air' English Camp 2025",
    title_zh: "2025年新加坡\"海陆空\"英语营",
    program_id: "SGLAN-2025-001",
    image: "/Edgoing/Program_Page/Singapore/English_Camp/Picture_1.png",
    location_en: "Singapore",
    location_zh: "新加坡",
    duration: "2 weeks",
    duration_en: "2 weeks",
    duration_zh: "2周",
    country: "Singapore",
    program_type_en: ["Language & Lifestyle", "Language Intensive"],
    program_type_zh: ["语言与生活", "语言强化"],
    destination_en: "Singapore",
    destination_zh: "新加坡",
    grade_level_en: ["Middle School", "High School"],
    grade_level_zh: ["初中", "高中"],
    grade_levels: ["Middle School", "High School", "初中", "高中"],
    overview_en: "The \"Sea, Land, and Sky\" English Camp in Singapore is a 7-day immersive program designed for students aged 10 to 15.",
    overview_zh: "新加坡\"海陆空\"英语营是一个为期7天的沉浸式项目，专为10至15岁的学生设计。"
  },
  {
    id: "3",
    title_en: "Singapore STEM & AI Camp 2025",
    title_zh: "2025年新加坡STEM与AI营",
    program_id: "SGSTEM-2025-003",
    image: "/Edgoing/Program_Page/Singapore/STEM/Picture_6.png",
    location_en: "Singapore",
    location_zh: "新加坡",
    duration: "7 days",
    duration_en: "7 days",
    duration_zh: "7 天",
    country: "Singapore",
    program_type_en: ["STEM & Science"],
    program_type_zh: ["STEM与科学创新"],
    destination_en: "Singapore",
    destination_zh: "新加坡",
    grade_level_en: ["Middle School", "High School"],
    grade_level_zh: ["初中", "高中"],
    grade_levels: ["Middle School", "High School", "初中", "高中"],
    overview_en: "AI and STEM focused courses and workshops at top Singaporean institutions like Nanyang Technological University and the Science Centre Singapore.",
    overview_zh: "AI与STEM重点课程，在新加坡南洋理工大学和科学中心等顶级机构进行。"
  }
] as Program[];

/**
 * 获取项目列表，支持筛选和分页
 */
export const fetchFrontendPrograms = async (
  filters: ProgramFilterParams = {},
  currentLanguage: 'en' | 'zh' = 'en'
): Promise<ProgramsResponse> => {
  try {
    console.log('前端服务 - 开始获取项目列表，应用筛选条件:', filters);

    // 直接从 Strapi 获取数据，不使用本地数据
    const result = await fetchStrapiPrograms(filters, currentLanguage);
    console.log('前端服务 - 成功从 Strapi 获取项目列表，总计:', result.total);
    return result;
  } catch (error) {
    console.error('前端服务 - 获取项目列表出错:', error);

    // 返回空数据，不使用静态数据
    return {
      data: [],
      total: 0,
      page: 1,
      totalPages: 1
    };
  }
};

/**
 * 获取项目筛选选项
 */
export const fetchProgramFilters = async (currentLanguage: 'en' | 'zh' = 'en') => {
  try {
    // 直接从 Strapi 获取筛选选项，不使用本地数据
    const filters = await fetchStrapiProgramFilters(currentLanguage);
    return filters;
  } catch (error) {
    console.error('Error fetching program filters:', error);

    // 返回空数据，不使用静态数据
    return {
      categories: [],
      gradeLevels: [],
      countries: []
    };
  }
};

/**
 * 获取单个项目详情
 */
export const fetchProgramById = async (id: string, currentLanguage: 'en' | 'zh' = 'en'): Promise<Program | null> => {
  try {
    console.log(`前端服务 - 开始获取ID为 ${id} 的项目`);

    // 首先尝试从 Strapi 获取数据
    try {
      const program = await fetchStrapiProgramById(id, currentLanguage);
      if (program) {
        console.log(`前端服务 - 成功从 Strapi 获取ID为 ${id} 的项目`);
        return program;
      }
    } catch (strapiError) {
      console.error(`前端服务 - 从 Strapi 获取ID为 ${id} 的项目失败，尝试文件服务:`, strapiError);
    }

    // 禁用文件服务和静态数据回退
    console.log(`前端服务 - 仅使用 Strapi 数据，不使用文件服务或静态数据`);
    throw new Error(`Program with ID ${id} not found in Strapi`);
  } catch (error) {
    console.error(`前端服务 - 获取ID为 ${id} 的项目出错:`, error);
    throw error;
  }
};
