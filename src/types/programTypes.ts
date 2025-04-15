export interface Program {
  id: string;  // 统一使用 string 类型
  title_en: string;
  title_zh: string;
  program_id: string;
  image: string;
  location_en: string;
  location_zh: string;
  duration: string;  // 保留原字段以保持向后兼容
  duration_en?: string; // 增加英文时长字段
  duration_zh?: string; // 增加中文时长字段
  country: string;
  country_en?: string[];    // 国家（英文）- 改为数组类型
  country_zh?: string[];    // 国家（中文）- 改为数组类型
  // 适用年级数组（内部使用）
  grade_levels: string[]; // Changed from optional to required

  // 新增字段 - 用于CMS和Supabase同步
  program_type_en?: string[]; // 项目类型（英文）
  program_type_zh?: string[]; // 项目类型（中文）
  destination_en?: string;  // 目的地（英文）
  destination_zh?: string;  // 目的地（中文）
  grade_level_en?: string[];  // 年级水平（英文）- 改为数组类型
  grade_level_zh?: string[];  // 年级水平（中文）- 改为数组类型

  // 营期和截止日期
  camp_period?: string;     // 营期
  camp_period_en?: string;  // 营期（英文）
  camp_period_zh?: string;  // 营期（中文）
  deadline?: string;        // 截止日期

  // 项目概述
  overview_en?: string;     // 项目概述（英文）
  overview_zh?: string;     // 项目概述（中文）

  description_en?: string;
  description_zh?: string;
  highlights_en?: string;
  highlights_zh?: string;
  itinerary_en?: string;
  itinerary_zh?: string;
  features_en?: string;
  features_zh?: string;
  other_info_en?: string;   // 额外信息（英文）
  other_info_zh?: string;   // 额外信息（中文）
  gallery_images?: string[]; // 添加轮播图片数组

  // 程序状态字段
  status?: string;          // 程序状态（如 'published', 'draft' 等）
  published_at?: string;    // 发布日期
}

export interface ProgramFilterParams {
  category?: string;
  region?: string;
  country?: string;
  gradeLevel?: string;
  programType?: string;  // 添加项目类型筛选参数
  page?: number;
  limit?: number;
  search?: string;
  ids?: string[];
  featured?: boolean;
}

export interface ProgramsResponse {
  data: Program[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProgramFormData {
  id: string;
  title: string; // Chinese title
  titleEn: string; // English title
  thumbnail: string;
  category: string;
  location: string; // Corresponds to summary in database
  duration: string;
  gradeLevel: string;
  description: string; // Chinese description
  descriptionEn: string; // English description
  highlights: string; // Chinese learning_outcomes
  highlightsEn: string; // English learning_outcomes
  itinerary: string; // Chinese requirements
  itineraryEn: string; // English requirements
  features: string; // Chinese instructor
  featuresEn: string; // English instructor
  information: string; // Additional information (Chinese)
  informationEn: string; // Additional information (English)
  price: string | number;
  images: string[];
}
